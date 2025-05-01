import { EventsCell } from '../../../../components/Table/cells/EventsCell.ts';
import type { ColumnDefinition } from '../../../../components/Table/types.ts';
import type { EventsGroupedByDay } from '../types.ts';

export const useEventTableColumns = (onDelete: () => void): ColumnDefinition<EventsGroupedByDay>[] => {
  return [
    {
      label: 'Events',
      render: item => new EventsCell(item.date, item.events, onDelete),
    },
  ];
};
