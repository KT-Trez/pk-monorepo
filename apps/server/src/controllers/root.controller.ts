import { DatabaseService } from '../components/database/DatabaseService.ts';
import { ServerError } from '../components/response/ServerError.ts';
import { ServerSuccess } from '../components/response/ServerSuccess.ts';
import { BaseController } from '../components/web/BaseController.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';
import type { NextFunction } from '../types/http.ts';

export class RootController extends BaseController {
  async healthCheck(_: WebServerRequest, res: WebServerResponse, next: NextFunction) {
    const row = await DatabaseService.instance.queryRow<{ success: true }>({
      queryTextOrConfig: 'SELECT true as success',
    });

    if (!row?.success) {
      return next(new ServerError({ message: 'Database is not reachable' }));
    }

    res.json(new ServerSuccess());
  }
}
