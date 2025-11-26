import { type FieldPath, type FieldValues, useController } from 'react-hook-form';
import { CheckboxField, type CheckboxFieldProps } from './CheckboxField.tsx';

type RHFCheckboxFieldProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TFieldName;
} & Omit<CheckboxFieldProps, 'onChange'>;

export const RHFCheckboxField = <TFieldValues extends FieldValues>({
  name,
  ...rest
}: RHFCheckboxFieldProps<TFieldValues>) => {
  const {
    formState,
    field: { onChange, ...field },
  } = useController({ name });

  const isDisabled = rest.disabled || formState.isSubmitting;

  return <CheckboxField disabled={isDisabled} onCheckedChange={onChange} {...field} {...rest} />;
};
