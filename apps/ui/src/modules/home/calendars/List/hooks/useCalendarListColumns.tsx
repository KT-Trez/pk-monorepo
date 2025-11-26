import type { CalendarApi } from '@pk/types/calendar.js';
import type { ColumnDef } from '@tanstack/react-table';
import { Globe, Lock } from 'lucide-react';
import { useMemo } from 'react';
import { Typography } from '@/components/Typography/Typography.tsx';

export const useCalendarListColumns = () => {
  return useMemo<ColumnDef<CalendarApi>[]>(
    () => [
      {
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Typography>{row.original.name}</Typography>
            <Typography variant="muted">{row.original.uid}</Typography>
          </div>
        ),
        header: 'Name',
      },
      {
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Typography>
              {row.original.author.name} {row.original.author.surname}
            </Typography>
            <Typography variant="muted">{row.original.author.uid}</Typography>
          </div>
        ),
        header: 'Author',
        id: 'author',
      },
      {
        cell: ({ row }) => (
          <div className="flex gap-2 items-center">
            {row.original.isPublic ? <Globe /> : <Lock />} {row.original.isPublic ? 'Public' : 'Private'}
          </div>
        ),
        header: 'Visibility',
      },
    ],
    [],
  );
};
