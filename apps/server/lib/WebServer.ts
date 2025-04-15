import { Server } from 'node:http';
import type { BaseController, RoutePath } from '../src/classes/BaseController.v3.ts';
import { ServerError } from './errors/ServerError.ts';
import type { HttpHandle } from './types.js';
import { WebServerRequest } from './WebServerRequest.ts';
import { WebServerResponse } from './WebServerResponse.ts';

export class WebServer {
  #controllers: BaseController[] = [];
  #httpServer: Server<typeof WebServerRequest, typeof WebServerResponse>;

  constructor() {
    this.#httpServer = new Server(
        {
          IncomingMessage: WebServerRequest,
          ServerResponse: WebServerResponse,
        },
        this.#processRequest.bind(this),
    );
  }

  listen(port: number, cb?: () => void) {
    this.#httpServer.listen(port, cb);
  }

  registerController(controller: BaseController) {
    this.#controllers.push(controller);
    return this;
  }

  async #processRequest(req: WebServerRequest, res: WebServerResponse) {
    await req._process();

    const routes = this.#controllers.reduce<HttpHandle[][]>((acc, controller) => {
      // the parameter does not have to be a RoutePath but since it's a check, we can accept it
      const controllerRoutes = controller._getRoutes(`${req.method} ${req.parsedURL.pathname}` as RoutePath);

      if (controllerRoutes) {
        acc.push(controllerRoutes);
      }

      return acc;
    }, []);

    for (const route of routes) {
      await this.#processRoutes(route, req, res);
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
      res.error(new ServerError({ cause: error }));
    }
  }
}
