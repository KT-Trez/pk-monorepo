import { LockKeyhole, Mail } from 'lucide-react';
import { RHFTextField } from '../../../components/TextField/RHFTextField.tsx';
import { Button } from '../../../components/ui/button.tsx';
import type { LoginFormDataIn } from '../validationSchema.ts';

export const MainSection = () => (
  <div className="flex flex-col items-center gap-4 h-fit w-full">
    <img alt="Wydział Informatyki i Telekomunikacji" className="max-h-28 w-fit" src="/wiit.png" />

    <RHFTextField<LoginFormDataIn> iconStart={<Mail />} name="email" placeholder="Enter email" type="email" />

    <RHFTextField<LoginFormDataIn>
      iconStart={<LockKeyhole />}
      name="password"
      placeholder="Enter password"
      type="password"
    />

    <Button className="w-full" type="submit">
      Login
    </Button>
  </div>
);
