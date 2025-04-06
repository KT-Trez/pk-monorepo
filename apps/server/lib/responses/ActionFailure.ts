import type { ActionFailureApi, HttpStatus } from '@pk/types/api.js';
import { ServerError } from '../errors/ServerError.ts';

export class ActionFailure extends ServerError implements ActionFailureApi {
  objects: Record<string, boolean>;
  success: false;

  constructor(all: string[] = [], succeeded: string[] = [], httpStatus?: HttpStatus) {
    super({ httpStatus, message: 'Action failed' });

    const objects: Record<string, boolean> = {};
    const succeededSet = new Set(succeeded);

    for (const uid of all) {
      objects[uid] = succeededSet.has(uid);
    }

    this.objects = objects;
    this.success = false;
  }
}
