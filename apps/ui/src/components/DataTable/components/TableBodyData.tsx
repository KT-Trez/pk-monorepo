import { TableCell, TableRow } from '@/components/ui/table.tsx';
import { flexRender } from '@tanstack/react-table';
import type { Table as ITable } from '@tanstack/react-table';

type TableBodyDataProps<TData> = {
  table: ITable<TData>;
};

export const TableBodyData = <TData,>({ table }: TableBodyDataProps<TData>) => {
  return table.getRowModel().rows.map(row => (
    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  ));
};
