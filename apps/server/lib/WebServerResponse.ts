import { type IncomingMessage, ServerResponse } from 'node:http';

export class WebServerResponse<TRequest extends IncomingMessage = IncomingMessage> extends ServerResponse<TRequest> {
  error({ cause, status, message }: { cause?: unknown; status: number; message: string }) {
    // biome-ignore lint/suspicious/noConsole: needed for error handling
    console.error(cause);

    if (!this.headersSent) {
      return;
    }

    this.writeHead(status);
    this.end(message);
  }

  json(data: unknown) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
  }
}
