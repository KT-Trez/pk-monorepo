import type { SuccessApi } from '@pk/types/api.js';
import type { EnrichedCalendarApi } from '@pk/types/calendar.js';
import { type RowAction, RowActionVariant } from '../../../../components/Table/types.ts';
import { client, notifier, sessionService } from '../../../../main.ts';
import type { SetterDispatch } from '../../../../types/useState.ts';

type UseRowActionsProps = {
  setCalendars: SetterDispatch<EnrichedCalendarApi[]>;
};

export const useRowActions = ({ setCalendars }: UseRowActionsProps): RowAction<EnrichedCalendarApi>[] => {
  return [
    {
      icon: 'share',
      isDisabled: calendar => !sessionService.hasPermission('calendar', 'share', calendar),
      label: 'Share',
      onClick: calendar => console.log(calendar),
      variant: RowActionVariant.Primary,
    },
    {
      icon: 'notification_add',
      isDisabled: calendar => !sessionService.hasPermission('calendar', 'follow', calendar),
      label: 'Follow',
      onClick: calendar => console.log(calendar),
      variant: RowActionVariant.Primary,
    },
    {
      icon: 'delete_forever',
      isDisabled: calendar => !sessionService.hasPermission('calendar', 'delete', calendar),
      label: 'Delete',
      onClick: async calendar => {
        try {
          const { success } = await client.delete<SuccessApi>(`/v1/calendar?uid=${calendar.uid}`);

          if (success) {
            setCalendars(prev => prev.filter(prevCalendar => prevCalendar.uid !== calendar.uid));

            const message = `Calendar ${calendar.name} (${calendar.uid}) deleted successfully.`;
            notifier.notify({ severity: 'success', text: message });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete calendar.';
          notifier.notify({ severity: 'error', text: message });
        }
      },
      variant: RowActionVariant.Danger,
    },
  ];
};
