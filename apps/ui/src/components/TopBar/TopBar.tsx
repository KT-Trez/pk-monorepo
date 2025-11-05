import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider/useAuth.ts';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { cn } from '@/lib/utils.ts';

type TopBarProps = {
  className?: string;
};

export const TopBar = ({ className }: TopBarProps) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    await logout();
    await navigate({ to: '/' });
  }, [logout, navigate]);

  return (
    <div className={cn('col-span-12 p-4 h-fit', className)}>
      <Card className=" py-2">
        <CardContent className="flex justify-between px-4">
          <img alt="Wydział Informatyki i Telekomunikacji" className="max-h-16" src="/wiit.png" />

          <div className="flex flex-row gap-2 items-center">
            {isAuthenticated && (
              <Button aria-label="Logout" onClick={handleLogout} size="icon" variant="outline">
                <LogOut />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
