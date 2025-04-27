import type { ListPageAction } from '../../../../components/PageContent/types.ts';
import { navigate } from '../../../../utils/navigate.ts';

export const usePageActions = (): ListPageAction[] => {
  return [
    {
      label: 'Create new user',
      onClick: () => navigate('#/admin/users/create'),
    },
  ];
};
