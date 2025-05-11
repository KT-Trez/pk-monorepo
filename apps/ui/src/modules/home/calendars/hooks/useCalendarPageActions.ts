import type { EnrichedCalendarApi } from '@pk/types/calendar.js';
import type { ListPageAction } from '../../../../components/PageContent/types.ts';
import { sessionService } from '../../../../main.ts';
import type { SetState } from '../../../../types/useState.ts';
import { navigate } from '../../../../utils/navigate.ts';
import { useState } from '../../../../utils/useState.ts';

export const useCalendarPageActions = (setCalendars: SetState<EnrichedCalendarApi[]>): ListPageAction[] => {
  const [setIsShowingAll, subscribeIsShowingAll] = useState<boolean>(true);
  const calendars: EnrichedCalendarApi[] = [];

  // god please have mercy upon your poor people
  subscribeIsShowingAll(isShowingAll => {
    setCalendars(prev => {
      if (calendars.length === 0) {
        calendars.push(...prev);
      }

      if (isShowingAll) {
        return calendars;
      }

      return prev.filter(calendar => {
        const userUid = sessionService.session?.user.uid ?? '';

        const isAuthor = calendar.authorUid === userUid;
        const isEditorOrViewer = !!calendar.sharedWith[userUid];

        return isAuthor || isEditorOrViewer;
      });
    });
  });

  return [
    {
      label: 'Create new calendar',
      onClick: () => navigate('#/home/calendars/create'),
    },
    {
      label: 'Show all / mine only',
      onClick: () => setIsShowingAll(prev => !prev),
      variant: 'outlined',
    },
  ];
};
