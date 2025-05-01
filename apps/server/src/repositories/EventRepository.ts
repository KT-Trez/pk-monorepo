import type { EventApi } from '@pk/types/event.js';
import { PostgresSQLRepository } from '../components/database/PostgresSQLRepository.ts';

export class EventRepository extends PostgresSQLRepository<EventApi> {
  constructor() {
    super({
      attributesDefinition: {
        authorUid: 'author_uid',
        calendarUid: 'calendar_uid',
        createdAt: 'created_at',
        description: 'description',
        endDate: 'end_date',
        location: 'location',
        modifiedAt: 'modified_at',
        startDate: 'start_date',
        title: 'title',
        uid: 'uid',
      },
      table: 'calendar.event',
    });
  }
}
