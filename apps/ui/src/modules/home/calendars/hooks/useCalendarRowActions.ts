import type { SuccessApi } from '@pk/types/api.js';
import {
  CalendarShareType,
  type EnrichedCalendarApi,
  type EnrichedCalendarShareApiPayload,
} from '@pk/types/calendar.js';
import { type RowAction, RowActionVariant } from '../../../../components/Table/types.ts';
import { client, sessionService } from '../../../../main.ts';
import type { SetState } from '../../../../types/useState.ts';
import { withNotification } from '../../../../utils/withNotification.ts';

export const useCalendarRowActions = (
  setCalendars: SetState<EnrichedCalendarApi[]>,
): RowAction<EnrichedCalendarApi>[] => {
  const updateCalendar = async (calendar: EnrichedCalendarApi) => {
    setCalendars(prev => prev.map(prevCalendar => (prevCalendar.uid === calendar.uid ? calendar : prevCalendar)));
  };

  return [
    {
      icon: 'share',
      isDisabled: calendar => !sessionService.hasPermission('calendar', 'share', calendar),
      isHidden: true, // TODO: remove this when the share calendar feature is implemented
      label: 'Share',
      onClick: calendar => console.log(calendar),
      variant: RowActionVariant.Primary,
    },
    {
      icon: 'notifications',
      isHidden: calendar => !sessionService.hasPermission('calendar', 'follow', calendar),
      label: 'Follow',
      onClick: async calendar => {
        const session = sessionService.session;

        if (!session) {
          return;
        }

        const payload: EnrichedCalendarShareApiPayload = {
          sharedWith: { [session.user.uid]: CalendarShareType.Viewer },
          uid: calendar.uid,
        };

        await withNotification({
          errorMessage: 'Failed to follow calendar.',
          onSuccess: calendar => updateCalendar(calendar),
          promise: client.put<EnrichedCalendarApi>('/v1/calendar/follow', payload),
          successMessage: `Calendar ${calendar.name} (${calendar.uid}) followed successfully.`,
        });
      },
      variant: RowActionVariant.Primary,
    },
    {
      icon: 'notifications_off',
      isHidden: calendar => !sessionService.hasPermission('calendar', 'unfollow', calendar),
      label: 'Unfollow',
      onClick: async calendar => {
        const session = sessionService.session;

        if (!session) {
          return;
        }

        const payload: EnrichedCalendarShareApiPayload = {
          sharedWith: { [session.user.uid]: null },
          uid: calendar.uid,
        };

        await withNotification({
          errorMessage: 'Failed to unfollow calendar.',
          onSuccess: calendar => updateCalendar(calendar),
          promise: client.put<EnrichedCalendarApi>('/v1/calendar/unfollow', payload),
          successMessage: `Calendar ${calendar.name} (${calendar.uid}) unfollowed successfully.`,
        });
      },
      variant: RowActionVariant.Danger,
    },
    {
      icon: 'delete_forever',
      isDisabled: calendar => !sessionService.hasPermission('calendar', 'delete', calendar),
      label: 'Delete',
      onClick: async calendar => {
        await withNotification({
          errorMessage: 'Failed to delete calendar.',
          onSuccess: () => setCalendars(prev => prev.filter(prevCalendar => prevCalendar.uid !== calendar.uid)),
          promise: client.delete<SuccessApi>(`/v1/calendar?uid=${calendar.uid}`),
          successMessage: `Calendar ${calendar.name} (${calendar.uid}) deleted successfully.`,
        });
      },
      variant: RowActionVariant.Danger,
    },
  ];
};
