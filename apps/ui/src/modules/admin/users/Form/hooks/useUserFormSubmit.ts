import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useTRPC } from '../../../../../utils/trpc.ts';
import type { UserFormDataOut } from '../validationSchema.ts';

export const useUserFormSubmit = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const trpc = useTRPC();
  const { mutateAsync } = useMutation(
    trpc.v1.user.createUser.mutationOptions({
      onSuccess: async user => {
        enqueueSnackbar(`User ${user.name} ${user.surname} (${user.uid}) created successfully`, { variant: 'success' });
        await navigate({ to: '/admin/users' });
      },
    }),
  );

  const handler = useCallback(
    async (formData: UserFormDataOut) => {
      const { passwordConfirmation: _, ...payload } = formData;

      try {
        await mutateAsync(payload);
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
