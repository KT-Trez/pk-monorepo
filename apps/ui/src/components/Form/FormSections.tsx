import { type NavigateOptions, useNavigate } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Button } from '../ui/button.tsx';
import { Card, CardContent } from '../ui/card.tsx';

type FormSectionsProps = {
  children: ReactNode;
  onCancel: NavigateOptions;
};

export const FormSections = ({ onCancel, children }: FormSectionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-between h-full relative">
      <div className="overflow-y-auto">{children}</div>

      <Card className="sticky bottom-2">
        <CardContent className="flex gap-2">
          <Button type="submit">Save</Button>

          <Button onClick={() => navigate(onCancel)} type="button" variant="outline">
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
