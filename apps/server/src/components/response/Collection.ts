import type { CollectionApi } from '@pk/types/api.js';
import type { UnknownObject } from '@pk/types/helpers.js';

export class Collection<ApiModel extends UnknownObject> implements CollectionApi<ApiModel> {
  hasMore: boolean;
  items: ApiModel[];
  limit: number;
  offset: number;

  constructor(args?: Partial<CollectionApi<ApiModel>>) {
    this.hasMore = args?.hasMore ?? false;
    this.items = args?.items ?? [];
    this.limit = args?.limit ?? 50;
    this.offset = args?.offset ?? 0;
  }
}
