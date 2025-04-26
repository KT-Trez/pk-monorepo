import type { EnrichedSessionApi } from '@pk/types/session.js';
import { PostgresSQLRepository } from '../components/database/PostgresSQLRepository.ts';

export class EnrichedSessionRepository extends PostgresSQLRepository<EnrichedSessionApi> {
  constructor() {
    super({
      attributesDefinition: {
        createdAt: 'created_at',
        expiresAt: 'expires_at',
        uid: 'uid',
        user: 'user',
      },
      table: 'session.enriched_session',
    });
  }
}
