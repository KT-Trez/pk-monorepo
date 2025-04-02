import { Server } from 'node:http';
import { NotFoundError } from './errors/NotFoundError.ts';
import { Router } from './Router.ts';
import { WebServerRequest } from './WebServerRequest.ts';
import { WebServerResponse } from './WebServerResponse.ts';

export class WebServer extends Router {
  #httpServer: Server<typeof WebServerRequest, typeof WebServerResponse>;

  constructor() {
    super();

    this.#httpServer = new Server(
        {
          // biome-ignore lint/style/useNamingConvention: IncomingMessage is a built-in class
          IncomingMessage: WebServerRequest,
          // biome-ignore lint/style/useNamingConvention: ServerResponse is a built-in class
          ServerResponse: WebServerResponse,
        },
        this.#requestHandle.bind(this),
    );
  }

  listen(port: number, cb?: () => void) {
    this.#httpServer.listen(port, cb);
  }

  #requestHandle(req: WebServerRequest, res: WebServerResponse) {
    req._process();

    const nextPath = req.nextPath;

    if (!nextPath) {
      return res.error(new NotFoundError(`path "${nextPath}"`));
    }

    super._requestHandle(nextPath, req, res).catch(console.error);
  }
}
