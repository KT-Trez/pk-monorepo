import { Typography } from '@/components/Typography/Typography.tsx';
import { TableCell, TableRow } from '@/components/ui/table.tsx';

type TableBodyLoadingProps = {
  columnsLength: number;
};

export const TableBodyEmpty = ({ columnsLength }: TableBodyLoadingProps) => {
  return (
    <TableRow>
      <TableCell colSpan={columnsLength} className="h-24 text-center">
        <Typography variant="muted"> No results.</Typography>
      </TableCell>
    </TableRow>
  );
};
