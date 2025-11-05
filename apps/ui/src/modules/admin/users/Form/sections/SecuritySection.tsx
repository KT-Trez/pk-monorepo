import { LockKeyhole, Mail } from 'lucide-react';
import { FormSection } from '../../../../../components/Form/FormSection.tsx';
import { RHFTextField } from '../../../../../components/TextField/RHFTextField.tsx';
import type { UserFormDataIn } from '../validationSchema.ts';

export const SecuritySection = () => {
  return (
    <FormSection title="Security">
      <RHFTextField<UserFormDataIn>
        iconStart={<Mail />}
        label="Email*"
        name="email"
        placeholder="Enter email"
        type="email"
      />

      <RHFTextField<UserFormDataIn>
        iconStart={<LockKeyhole />}
        label="Password*"
        name="password"
        placeholder="Enter password"
        type="password"
      />

      <RHFTextField<UserFormDataIn>
        iconStart={<LockKeyhole />}
        label="Password confirmation*"
        name="passwordConfirmation"
        placeholder="Repeat password"
        type="password"
      />
    </FormSection>
  );
};
