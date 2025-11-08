import { flexRender, type Table as ITable } from '@tanstack/react-table';
import { TableHead, TableRow } from '../../ui/table.tsx';

type TableHeaderData<TData> = {
  table: ITable<TData>;
};

export const TableHeaderData = <TData,>({ table }: TableHeaderData<TData>) =>
  table.getHeaderGroups().map(headerGroup => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map(header => (
        <TableHead key={header.id}>
          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
        </TableHead>
      ))}
    </TableRow>
  ));
