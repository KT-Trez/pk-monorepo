import type { ActionSuccessApi } from '@pk/types/api.js';

export class ActionSuccess implements ActionSuccessApi {
  message: string;
  success: true;
  objects: Record<string, true>;

  constructor(all: string[]) {
    this.message = 'Action succeeded';
    this.objects = all.reduce<Record<string, true>>((acc, uid) => {
      acc[uid] = true;

      return acc;
    }, {});
    this.success = true;
  }
}
