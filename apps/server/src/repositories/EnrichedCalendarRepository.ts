import type { EnrichedCalendarApi } from '@pk/types/calendar.js';
import { PostgresSQLRepository } from '../components/database/PostgresSQLRepository.ts';

export class EnrichedCalendarRepository extends PostgresSQLRepository<EnrichedCalendarApi> {
  constructor() {
    super({
      attributesDefinition: {
        authorUid: 'author_uid',
        createdAt: 'created_at',
        isPublic: 'is_public',
        modifiedAt: 'modified_at',
        name: 'name',
        sharedWith: 'shared_with',
        uid: 'uid',
      },
      table: 'calendar.enriched_calendar',
    });
  }
}
