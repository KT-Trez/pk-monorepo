import type { EventApi, EventDb } from '@pk/types/event.js';
import { ObjectType } from '@pk/types/objectType.js';
import { AbstractObjectTransformer } from '../classes/AbstractObjectTransformer.ts';

export class EventTransformer extends AbstractObjectTransformer<EventApi, EventDb> {
  toApiObject(dbModel: EventDb): EventApi {
    return {
      description: dbModel.description,
      endDate: dbModel.end_date,
      location: dbModel.location,
      startDate: dbModel.start_date,
      title: dbModel.title,
      type: dbModel.object_type_id,
      uid: dbModel.event_uid,
    };
  }

  toDbObject(apiModel: Partial<EventApi>): Partial<EventDb> {
    return this.removeUndefined({
      description: apiModel.description,
      end_date: apiModel.endDate,
      location: apiModel.location,
      object_type_id: ObjectType.event,
      start_date: apiModel.startDate,
      title: apiModel.title,
    });
  }
}
