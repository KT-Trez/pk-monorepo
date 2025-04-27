import type { FullUserApi } from '@pk/types/user.js';
import { DateCell } from '../../../../components/Table/cells/DateCell.ts';
import { NameCell } from '../../../../components/Table/cells/NameCell.ts';
import type { ColumnDefinition } from '../../../../components/Table/types.ts';
import { Typography } from '../../../../components/Typography/Typography.ts';

export const useTableColumns = (): ColumnDefinition<FullUserApi>[] => {
  return [
    {
      label: 'Full name',
      render: item => new NameCell(`${item.name} ${item.surname}`, item.uid),
    },
    {
      label: 'Email',
      render: item => new Typography({ text: item.email }),
    },
    {
      label: 'Roles',
      render: item => new Typography({ text: item.roles.join(', ') }),
    },
    {
      label: 'Created at',
      render: item => new DateCell(item.createdAt),
    },
    {
      label: 'Modified at',
      render: item => new DateCell(item.modifiedAt),
    },
  ];
};
