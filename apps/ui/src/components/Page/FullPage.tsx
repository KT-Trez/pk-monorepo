import type { ReactNode } from 'react';
import { cn } from '../../lib/utils.ts';

type FullPageProps = {
  children: ReactNode;
  end?: `col-end-${number}`;
  start?: `col-start-${number}`;
};

export const FullPage = ({ children, end = 'col-end-9', start = 'col-start-5' }: FullPageProps) => (
  <div className="col-span-12 grid grid-cols-12">
    <div className={cn('flex items-center', end, start)}>{children}</div>
  </div>
);
