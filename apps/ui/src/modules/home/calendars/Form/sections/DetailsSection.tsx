import { RHFCheckboxField } from '../../../../../components/Checkbox/RHFCheckboxField.tsx';
import { FormSection } from '../../../../../components/Form/FormSection.tsx';
import { RHFTextField } from '../../../../../components/TextField/RHFTextField.tsx';
import type { CalendarFormDataIn } from '../validationSchema.ts';

export const DetailsSection = () => {
  return (
    <FormSection title="Details">
      <RHFTextField<CalendarFormDataIn> label="Name*" name="name" placeholder="Enter name" />

      <RHFCheckboxField<CalendarFormDataIn>
        description="If enabled, the calendar will be visible to all users."
        label="Public"
        name="isPublic"
      />
    </FormSection>
  );
};
