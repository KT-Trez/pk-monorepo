import type { Table as ITable } from '@tanstack/react-table';
import { TableHeaderData } from './TableHeaderData.tsx';
import { TableHeaderEmpty } from './TableHeaderEmpty.tsx';

type TableHeaderSectionProps<TData> = {
  isLoading?: boolean;
  table: ITable<TData>;
};

export const TableHeaderSection = <TData,>({ isLoading, table }: TableHeaderSectionProps<TData>) => {
  if (isLoading || !table.getRowCount()) {
    return <TableHeaderEmpty />;
  }

  return <TableHeaderData table={table} />;
};
