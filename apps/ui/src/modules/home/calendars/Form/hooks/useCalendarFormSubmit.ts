import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useTRPC } from '../../../../../utils/trpc.ts';
import type { CalendarFormDataOut } from '../validationSchema.ts';

export const useCalendarFormSubmit = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const trpc = useTRPC();
  const { mutateAsync } = useMutation(
    trpc.v1.calendar.createCalendar.mutationOptions({
      onSuccess: async calendar => {
        enqueueSnackbar(`Calendar ${calendar.name} (${calendar.uid}) created successfully`, { variant: 'success' });
        await navigate({ to: '/home/calendars' });
      },
    }),
  );

  const handler = useCallback(
    async (formData: CalendarFormDataOut) => {
      try {
        await mutateAsync(formData);
      } catch (_err) {
        // error handled by `useMutation`
      }
    },
    [mutateAsync],
  );

  return {
    handler,
  };
};
