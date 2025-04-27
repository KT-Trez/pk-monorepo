import type { FullUserApi } from '@pk/types/user.js';
import { PostgresSQLRepository } from '../components/database/PostgresSQLRepository.ts';

export class FullUserRepository extends PostgresSQLRepository<FullUserApi> {
  constructor() {
    super({
      attributesDefinition: {
        createdAt: 'created_at',
        email: 'email',
        modifiedAt: 'modified_at',
        name: 'name',
        roles: 'roles',
        surname: 'surname',
        uid: 'uid',
      },
      table: 'public.full_user',
    });
  }
}
