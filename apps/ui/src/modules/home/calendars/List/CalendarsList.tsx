import { UserRoleEnum } from '@pk/types/user.js';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useAuth } from '@/components/AuthProvider/useAuth.ts';
import { DataTable } from '@/components/DataTable/DataTable.tsx';
import { useCalendarListColumns } from './hooks/useCalendarListColumns.tsx';
import { useCalendarsFetch } from './hooks/useCalendarsFetch.ts';

export const CalendarsList = () => {
  const { hasRole } = useAuth();
  const columns = useCalendarListColumns();
  const { data, isLoading } = useCalendarsFetch();

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    initialState: {
      columnVisibility: {
        author: hasRole(UserRoleEnum.Admin),
      },
    },
  });

  return <DataTable className="bg-card pt-3" isLoading={isLoading} table={table} />;
};
