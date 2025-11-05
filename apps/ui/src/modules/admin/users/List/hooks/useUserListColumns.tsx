import type { User } from '@pk/server/src/entity/User.ts';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Typography } from '@/components/Typography/Typography.tsx';

export const useUserListColumns = () => {
  return useMemo<ColumnDef<User>[]>(
    () => [
      {
        cell: ({ row }) => (
          <div className="flex flex-col">
            <Typography>
              {row.original.name} {row.original.surname}
            </Typography>
            <Typography variant="muted">{row.original.uid}</Typography>
          </div>
        ),
        header: 'Full name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
    ],
    [],
  );
};
