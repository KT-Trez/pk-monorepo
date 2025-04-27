import type { SuccessApi } from '@pk/types/api.js';
import type { FullUserApi } from '@pk/types/user.js';
import { type RowAction, RowActionVariant } from '../../../../components/Table/types.ts';
import { client, notifier, sessionService } from '../../../../main.ts';
import type { SetterDispatch } from '../../../../types/useState.ts';

type UseRowActionsProps = {
  setUsers: SetterDispatch<FullUserApi[]>;
};

export const useRowActions = ({ setUsers }: UseRowActionsProps): RowAction<FullUserApi>[] => {
  return [
    {
      icon: 'delete_forever',
      isDisabled: user => user.uid === sessionService.session?.user?.uid,
      label: 'Delete',
      onClick: async user => {
        try {
          const { success } = await client.delete<SuccessApi>(`/v1/user?uid=${user.uid}`);

          if (success) {
            setUsers(prev => prev.filter(prevUser => prevUser.uid !== user.uid));

            const message = `User ${user.name} ${user.surname} (${user.uid}) deleted successfully.`;
            notifier.notify({ severity: 'success', text: message });
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete user.';
          notifier.notify({ severity: 'error', text: message });
        }
      },
      variant: RowActionVariant.Danger,
    },
  ];
};
