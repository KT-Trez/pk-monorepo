import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable/DataTable.tsx';
import { useUserColumns } from '@/modules/admin/users/List/hooks/useUserColumns.tsx';
import { useUsersFetch } from './hooks/useUsersFetch.ts';

export const UsersList = () => {
  const columns = useUserColumns();
  const { data, isLoading } = useUsersFetch();

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4 pl-2">
      <DataTable className="bg-card pt-3" isLoading={isLoading} table={table} />
    </div>
  );
};
