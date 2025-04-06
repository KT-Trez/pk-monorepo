import type { ActionFailureApi, HttpStatus } from '@pk/types/api.js';
import { ServerError } from '../../../lib/errors/ServerError.ts';

export class ActionFailure extends ServerError implements ActionFailureApi {
  objects: Record<string, boolean>;
  success: false;

  constructor(allUid: string[] = [], succeededUid: string[] = [], httpStatus?: HttpStatus) {
    super({ httpStatus, message: 'Action failed' });

    const succeededSet = new Set(succeededUid);

    this.objects = allUid.reduce<Record<string, boolean>>((acc, uid) => {
      acc[uid] = succeededSet.has(uid);

      return acc;
    }, {});

    this.success = false;
  }
}
