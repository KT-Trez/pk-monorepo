import type { ListPageAction } from '../../../../components/PageContent/types.ts';
import { navigate } from '../../../../utils/navigate.ts';

export const useCalendarPageActions = (): ListPageAction[] => {
  return [
    {
      label: 'Create new calendar',
      onClick: () => navigate('#/home/calendars/create'),
    },
  ];
};
