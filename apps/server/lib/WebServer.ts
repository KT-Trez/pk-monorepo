import { noop } from '@pk/utils/noop.js';
import { Server } from 'node:http';
import { Router } from './Router.ts';
import { WebServerRequest } from './WebServerRequest.ts';
import { WebServerResponse } from './WebServerResponse.ts';

export class WebServer extends Router {
  #httpServer: Server<typeof WebServerRequest, typeof WebServerResponse>;

  constructor() {
    super();
    this.#httpServer = new Server(
        {
          IncomingMessage: WebServerRequest,
          ServerResponse: WebServerResponse,
        },
        this.#requestHandler,
    );
  }

  listen(port: number) {
    this.#httpServer.listen(port);
  }

  #requestHandler(req: WebServerRequest, res: WebServerResponse) {
    const nextPath = req.nextPath;

    if (!nextPath) {
      return res.error({ status: 404, message: 'Not Found' });
    }

    super.handleRequest(nextPath, req, res).then(noop);
  }
}
