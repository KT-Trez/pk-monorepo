import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.ts';
import { Typography } from '../Typography/Typography.tsx';

type FormSectionProps = {
  children: ReactNode;
  flex?: boolean;
  title: string;
};

export const FormSection = ({ children, flex = true, title }: FormSectionProps) => {
  return (
    <div className="px-8 py-4">
      <Typography className="text-primary" variant="h3">
        {title}
      </Typography>

      <div className="grid grid-cols-10 mt-4">
        <div className={cn('col-span-4', flex ? 'flex flex-col gap-4' : undefined)}>{children}</div>
      </div>
    </div>
  );
};
