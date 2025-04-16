import type { ServerError } from '../components/response/ServerError.js';
import type { WebServerRequest } from '../components/web/WebServerRequest.js';
import type { WebServerResponse } from '../components/web/WebServerResponse.js';

export type HttpHandle = (req: WebServerRequest, res: WebServerResponse, next: NextFunction) => Promise<void>;

export type HttpMethods = 'DELETE' | 'GET' | 'POST' | 'PUT';

export type NextFunction = (error: ServerError) => void;
