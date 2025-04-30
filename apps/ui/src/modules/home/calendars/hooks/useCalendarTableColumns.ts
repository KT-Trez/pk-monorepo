import type { EnrichedCalendarApi } from '@pk/types/calendar.js';
import { DateCell } from '../../../../components/Table/cells/DateCell.ts';
import { NameCell } from '../../../../components/Table/cells/NameCell.ts';
import { VisibilityCell, VisibilityType } from '../../../../components/Table/cells/VisibilityCell.ts';
import type { ColumnDefinition } from '../../../../components/Table/types.ts';
import { Typography } from '../../../../components/Typography/Typography.ts';

export const useCalendarTableColumns = (): ColumnDefinition<EnrichedCalendarApi>[] => {
  return [
    {
      label: 'Name',
      render: item => new NameCell(`${item.name}`, item.uid),
    },
    {
      label: 'Visibility',
      render: item => new VisibilityCell(item.isPublic ? VisibilityType.Public : VisibilityType.Private),
    },
    {
      label: 'Shared with',
      render: item => {
        const sharedWithCount = Object.keys(item.sharedWith).length;
        const sharedWithLabel = sharedWithCount !== 1 ? 'users' : 'user';

        return new Typography({ text: `${sharedWithCount} ${sharedWithLabel}` });
      },
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
