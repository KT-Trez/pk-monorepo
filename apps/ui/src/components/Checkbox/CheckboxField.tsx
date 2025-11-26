import type { ComponentProps } from 'react';
import { useIdAttribute } from '../../hooks/useIdAttribute.ts';
import { Checkbox } from '../ui/checkbox.tsx';
import { Label } from '../ui/label.tsx';

export type CheckboxFieldProps = {
  description?: string;
  label?: string;
} & Omit<ComponentProps<typeof Checkbox>, 'id'>;

export const CheckboxField = ({ description, label, ...rest }: CheckboxFieldProps) => {
  const id = useIdAttribute();

  return (
    <div className="flex items-start gap-3">
      <Checkbox id={id} {...rest} />

      <div className="grid gap-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
    </div>
  );
};
