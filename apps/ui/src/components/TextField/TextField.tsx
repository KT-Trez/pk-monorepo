import type { ComponentProps, ReactNode } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field.tsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';

export type TextFieldProps = {
  description?: string;
  error?: string;
  helperText?: string;
  iconEnd?: ReactNode;
  iconStart?: ReactNode;
  label?: string;
} & Omit<ComponentProps<'input'>, 'id'>;

export const TextField = ({ description, error, helperText, iconEnd, iconStart, label, ...rest }: TextFieldProps) => (
  <Field data-invalid={!!error}>
    {label && <FieldLabel htmlFor="checkout-7j9-card-name-43j">{label}</FieldLabel>}
    {description && <FieldDescription>{description}</FieldDescription>}

    <InputGroup>
      {iconStart && <InputGroupAddon>{iconStart}</InputGroupAddon>}
      <InputGroupInput data-invalid={!!error} id="checkout-7j9-card-name-43j" {...rest} />
      {iconEnd && <InputGroupAddon>{iconEnd}</InputGroupAddon>}
    </InputGroup>

    {helperText && <FieldDescription>{helperText}</FieldDescription>}
    {error && <FieldError>{error}</FieldError>}
  </Field>
);
