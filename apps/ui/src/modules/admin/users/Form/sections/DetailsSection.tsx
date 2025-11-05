import { FormSection } from '../../../../../components/Form/FormSection.tsx';
import { RHFTextField } from '../../../../../components/TextField/RHFTextField.tsx';
import type { UserFormDataIn } from '../validationSchema.ts';

export const DetailsSection = () => {
  return (
    <FormSection title="Details">
      <RHFTextField<UserFormDataIn> label="Name*" name="name" placeholder="Enter name" />
      <RHFTextField<UserFormDataIn> label="Surname*" name="surname" placeholder="Enter surname" />
    </FormSection>
  );
};
