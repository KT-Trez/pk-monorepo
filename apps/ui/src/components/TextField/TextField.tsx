import type { ComponentProps, ReactNode } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field.tsx';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group.tsx';
import { useIdAttribute } from '../../hooks/useIdAttribute.ts';

export type TextFieldProps = {
  description?: string;
  error?: string;
  helperText?: string;
  iconEnd?: ReactNode;
  iconStart?: ReactNode;
  label?: string;
} & Omit<ComponentProps<typeof InputGroupInput>, 'id'>;

export const TextField = ({ description, error, helperText, iconEnd, iconStart, label, ...rest }: TextFieldProps) => {
  const id = useIdAttribute();

  return (
    <Field data-invalid={!!error}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      {description && <FieldDescription>{description}</FieldDescription>}

      <InputGroup>
        {iconStart && <InputGroupAddon>{iconStart}</InputGroupAddon>}
        <InputGroupInput data-invalid={!!error} id={id} {...rest} />
        {iconEnd && <InputGroupAddon>{iconEnd}</InputGroupAddon>}
      </InputGroup>

      {helperText && <FieldDescription>{helperText}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};
