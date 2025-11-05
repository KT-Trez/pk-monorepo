import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { DataTable } from '@/components/DataTable/DataTable.tsx';
import { useUserListColumns } from '@/modules/admin/users/List/hooks/useUserListColumns.tsx';
import { useUsersFetch } from './hooks/useUsersFetch.ts';

export const UsersList = () => {
  const columns = useUserListColumns();
  const { data, isLoading } = useUsersFetch();

  console.log(data);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return <DataTable className="bg-card pt-3" isLoading={isLoading} table={table} />;
};
