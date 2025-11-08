import type { ReactNode } from 'react';
import type { ListPageAction } from '@/components/Page/types.ts';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Button } from '../ui/button.tsx';

type ListPageProps = {
  actions?: ListPageAction[];
  children: ReactNode;
};

export const ListPage = ({ actions, children }: ListPageProps) => {
  return (
    <div className="grid grid-cols-10 gap-4 h-full">
      <div className={actions ? 'col-span-8' : 'col-span-10'}>{children}</div>

      {actions && (
        <div className="col-span-2">
          <Card className="h-full">
            <CardContent className="px-4">
              {actions.map(action => (
                <Button className="w-full" key={action.label} onClick={action.onClick}>
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
