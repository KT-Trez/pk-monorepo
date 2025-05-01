import type { Option } from '@pk/types/option.js';
import { BaseController } from '../components/web/BaseController.ts';
import type { WebServerRequest } from '../components/web/WebServerRequest.ts';
import type { WebServerResponse } from '../components/web/WebServerResponse.ts';
import { enrichedCalendarRepository } from '../main.ts';

export class OptionsController extends BaseController {
  static readonly #limit = 99_999;

  async getCalendarOptions(req: WebServerRequest, res: WebServerResponse) {
    const calendars = await enrichedCalendarRepository.find({}, { limit: OptionsController.#limit, orderBy: 'name' });

    const options = calendars.reduce<Option[]>((acc, calendar) => {
      if (req.session.hasPermission('options', 'calendar', calendar)) {
        acc.push({ name: calendar.name, uid: calendar.uid });
      }

      return acc;
    }, []);

    res.json(options);
  }
}
