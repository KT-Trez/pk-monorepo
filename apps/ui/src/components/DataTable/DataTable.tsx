import type { Table as ITable } from '@tanstack/react-table';
import { TableBodySection } from '@/components/DataTable/components/TableBodySection.tsx';
import { Table, TableBody, TableHeader } from '@/components/ui/table';
import { cn } from '@/lib/utils.ts';
import { TableHeaderSection } from './components/TableHeaderSection.tsx';

type DataTableProps<TData> = {
  className?: string;
  isLoading?: boolean;
  table: ITable<TData>;
};

export const DataTable = <TData,>({ className, isLoading, table }: DataTableProps<TData>) => {
  return (
    <div className={cn('overflow-hidden rounded-md border ', className)}>
      <Table>
        <TableHeader>
          <TableHeaderSection isLoading={isLoading} table={table} />
        </TableHeader>
        <TableBody>
          <TableBodySection isLoading={isLoading} table={table} />
        </TableBody>
      </Table>
    </div>
  );
};
