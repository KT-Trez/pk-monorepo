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

  async #requestHandle(req: WebServerRequest, res: WebServerResponse) {
    await req._process();

    const path = req._getNextPath();

    if (!path) {
      return res.error(new NotFoundError(`[PATH] "${path}"`));
    }

    super._httpHandle(path, req, res).catch(console.error);
  }
}
