import { Server } from 'node:http';
import { Severity } from '@pk/utils/Logger/types.js';
import type { HttpHandle, HttpMethods } from '../../types/http.ts';
import { logger } from '../logger/logger.ts';
import { NotFoundError } from '../response/NotFoundError.ts';
import { ServerError } from '../response/ServerError.ts';
import { Unauthorized } from '../response/Unauthorized.ts';
import type { BaseController, RoutePath } from './BaseController.ts';
import type { BaseService } from './BaseService.js';
import { WebServerRequest } from './WebServerRequest.ts';
import { WebServerResponse } from './WebServerResponse.ts';

export class WebServer {
  #authenticatedControllers: Map<RoutePath, BaseController> = new Map();
  #controllers: Map<RoutePath, BaseController> = new Map();
  #httpServer: Server<typeof WebServerRequest, typeof WebServerResponse>;
  #services: BaseService[] = [];

  constructor() {
    this.#httpServer = new Server(
      {
        IncomingMessage: WebServerRequest,
        ServerResponse: WebServerResponse,
      },
      this.#processRequest.bind(this),
    );
  }

  async listen(port: number, cb?: () => void) {
    for (const service of this.#services) {
      await service.asyncConstructor();
    }

    this.#httpServer.listen(port, cb);
    logger.log({ message: `Server is listening on port: "${port}"`, severity: Severity.Success });
  }

  registerAuthenticatedController(controller: BaseController) {
    this.#registerRoutes(controller, this.#authenticatedControllers);
    return this;
  }

  registerController(controller: BaseController) {
    this.#registerRoutes(controller, this.#controllers);
    return this;
  }

  registerService(service: BaseService) {
    this.#services.push(service);
    return this;
  }

  async #processRequest(req: WebServerRequest, res: WebServerResponse) {
    await req._process();

    const path: RoutePath = `${req.method as HttpMethods} ${req.parsedURL.pathname}`;
    const controller = this.#controllers.get(path);
    const routes = controller?._getRoute(path);

    if (routes) {
      await this.#processRoutes(routes, req, res);
    }

    const hasSession = await req._processSession();

    if (!(res.headersSent || hasSession)) {
      return res.error(new Unauthorized('Session not found'));
    }

    const authenticatedController = this.#authenticatedControllers.get(path);
    const authenticatedRoutes = authenticatedController?._getRoute(path);

    if (authenticatedRoutes) {
      await this.#processRoutes(authenticatedRoutes, req, res);
    }

    if (!res.headersSent) {
      res.error(new NotFoundError(req.parsedURL.pathname));
    }
  }

  async #processRoutes(routes: HttpHandle[], req: WebServerRequest, res: WebServerResponse) {
    try {
      // prepare the next function
      let error: ServerError | null = null;
      const next = (err: ServerError) => {
        error = err;
      };

      // iterate and call the route routes
      for (const route of routes) {
        if (error) {
          break;
        }

        await route(req, res, next);
      }

      // if there was an error, call the error handler
      if (error) {
        res.error(error);
      }
    } catch (error) {
      if (error instanceof ServerError) {
        return res.error(error);
      }

      res.error(new ServerError({ cause: error }));
    }
  }

  #registerRoutes(controller: BaseController, map: Map<RoutePath, BaseController>) {
    const routes = controller._getPaths();
    for (const route of routes) {
      map.set(route, controller);
    }
  }
}
