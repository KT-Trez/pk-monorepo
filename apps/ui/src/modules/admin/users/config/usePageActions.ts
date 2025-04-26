import type { ListPageAction } from '../../../../components/PageContent/types.ts';

export const usePageActions = (): ListPageAction[] => {
  return [
    {
      label: 'Create new user',
      onClick: () => console.log('Create new user'),
    },
  ];
};
