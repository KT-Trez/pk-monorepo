import type { Table as ITable } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { TableCell, TableRow } from '@/components/ui/table.tsx';

type TableBodyDataProps<TData> = {
  table: ITable<TData>;
};

export const TableBodyData = <TData,>({ table }: TableBodyDataProps<TData>) => {
  return table.getRowModel().rows.map(row => (
    <TableRow data-state={row.getIsSelected() && 'selected'} key={row.id}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  ));
};
