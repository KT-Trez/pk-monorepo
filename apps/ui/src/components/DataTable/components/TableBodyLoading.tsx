import { TableCell, TableRow } from '@/components/ui/table.tsx';
import { Skeleton } from '../../ui/skeleton.tsx';

type TableBodyLoadingProps = {
  columnsLength: number;
};

export const TableBodyLoading = ({ columnsLength }: TableBodyLoadingProps) => {
  return Array.from({ length: 2 }).map((_, index) => (
    <TableRow key={`loading-${index.toString()}`}>
      {Array.from({ length: columnsLength }).map((_, index) => (
        <TableCell key={index.toString()}>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-4/5" />
          </div>
        </TableCell>
      ))}
    </TableRow>
  ));
};
