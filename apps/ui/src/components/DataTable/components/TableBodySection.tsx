import { TableBodyData } from '@/components/DataTable/components/TableBodyData.tsx';
import { TableBodyEmpty } from '@/components/DataTable/components/TableBodyEmpty.tsx';
import { TableBodyLoading } from '@/components/DataTable/components/TableBodyLoading.tsx';
import type { Table as ITable } from '@tanstack/react-table';

type TableBodySectionProps<TData> = {
  isLoading?: boolean;
  table: ITable<TData>;
};

export const TableBodySection = <TData,>({ isLoading, table }: TableBodySectionProps<TData>) => {
  if (isLoading) {
    return <TableBodyLoading columnsLength={table.getAllColumns().length} />;
  }

  if (!table.getRowCount()) {
    return <TableBodyEmpty columnsLength={table.getAllColumns().length} />;
  }

  return <TableBodyData table={table} />;
};
