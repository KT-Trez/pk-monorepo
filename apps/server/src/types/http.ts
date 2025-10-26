import type { ServerError } from '../components/response/ServerError.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';

export type HttpHandle = (req: WebServerRequest, res: WebServerResponse, next: NextFunction) => Promise<void>;

export type HttpMethods = 'DELETE' | 'GET' | 'POST' | 'PUT';

export type NextFunction = (error: ServerError) => void;
