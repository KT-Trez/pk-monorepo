import { TableBodySection } from '@/components/DataTable/components/TableBodySection.tsx';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils.ts';
import { flexRender } from '@tanstack/react-table';
import type { Table as ITable } from '@tanstack/react-table';

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
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          <TableBodySection isLoading={isLoading} table={table} />
        </TableBody>
      </Table>
    </div>
  );
};
