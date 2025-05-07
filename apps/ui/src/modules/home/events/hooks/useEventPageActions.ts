import type { ListPageAction } from '../../../../components/PageContent/types.ts';
import { navigate } from '../../../../utils/navigate.ts';

export const useEventPageActions = (scrollToUpcomingEvents: () => void): ListPageAction[] => {
  return [
    {
      label: 'Create new event',
      onClick: () => navigate('#/home/events/create'),
    },
    {
      label: 'Today',
      onClick: () => scrollToUpcomingEvents(),
      variant: 'outlined',
    },
  ];
};
