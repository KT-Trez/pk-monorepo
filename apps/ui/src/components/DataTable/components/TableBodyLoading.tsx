import { TableCell, TableRow } from '@/components/ui/table.tsx';

type TableBodyLoadingProps = {
  columnsLength: number;
};

export const TableBodyLoading = ({ columnsLength }: TableBodyLoadingProps) => {
  return Array.from({ length: 3 }).map((_, index) => (
    <TableRow key={`loading-${index.toString()}`}>
      <TableCell colSpan={columnsLength} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  ));
};
