import { Typography } from '@/components/Typography/Typography.tsx';
import { TableCell, TableRow } from '@/components/ui/table.tsx';

type TableBodyLoadingProps = {
  columnsLength: number;
};

export const TableBodyEmpty = ({ columnsLength }: TableBodyLoadingProps) => {
  return (
    <TableRow>
      <TableCell className="h-24 text-center" colSpan={columnsLength}>
        <Typography variant="muted"> No results.</Typography>
      </TableCell>
    </TableRow>
  );
};
