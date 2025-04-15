import { HttpStatus, type HttpStatuses, type SuccessApi } from '@pk/types/api.js';

export class ServerSuccess implements SuccessApi {
  code: HttpStatuses;
  message: string;
  success: true;

  constructor() {
    this.code = HttpStatus.Ok;
    this.message = 'OK';
    this.success = true;
  }
}
