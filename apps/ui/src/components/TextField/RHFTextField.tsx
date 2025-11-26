import { type FieldPath, type FieldValues, useController } from 'react-hook-form';
import { TextField, type TextFieldProps } from '@/components/TextField/TextField.tsx';

type RHFTextFieldProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<TextFieldProps, 'onChange'> & {
  name: TFieldName;
};

export const RHFTextField = <TFieldValues extends FieldValues>({
  error,
  name,
  ...rest
}: RHFTextFieldProps<TFieldValues>) => {
  const { fieldState, formState, field } = useController({ name });

  const isDisabled = rest.disabled || formState.isSubmitting;
  const errorText = error ?? fieldState.error?.message;

  return <TextField disabled={isDisabled} error={errorText} {...field} {...rest} />;
};
