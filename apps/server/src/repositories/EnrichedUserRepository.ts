import type { EnrichedUserApi } from '@pk/types/user.js';
import { PostgresSQLRepository } from '../components/database/PostgresSQLRepository.ts';

export class EnrichedUserRepository extends PostgresSQLRepository<EnrichedUserApi> {
  constructor() {
    super({
      attributesDefinition: {
        createdAt: 'created_at',
        email: 'email',
        modifiedAt: 'modified_at',
        name: 'name',
        password: 'password',
        roles: 'roles',
        surname: 'surname',
        uid: 'uid',
      },
      table: 'enriched_user',
    });
  }
}
