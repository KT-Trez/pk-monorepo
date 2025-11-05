import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import type { EmptyObject } from 'type-fest';
import { FormSections } from '../../../../components/Form/FormSections.tsx';
import { userFormDefaultValues } from './constants.ts';
import { useUserFormSubmit } from './hooks/useUserFormSubmit.ts';
import { DetailsSection } from './sections/DetailsSection.tsx';
import { SecuritySection } from './sections/SecuritySection.tsx';
import { type UserFormDataIn, type UserFormDataOut, userFormValidationSchema } from './validationSchema.ts';

export const UserForm = () => {
  const methods = useForm<UserFormDataIn, EmptyObject, UserFormDataOut>({
    defaultValues: userFormDefaultValues,
    mode: 'onTouched',
    resolver: zodResolver(userFormValidationSchema),
  });

  const { handler } = useUserFormSubmit();

  return (
    <form className="h-full" onSubmit={methods.handleSubmit(handler)}>
      <FormProvider {...methods}>
        <FormSections onCancel={{ to: '/admin/users' }}>
          <DetailsSection />
          <SecuritySection />
        </FormSections>
      </FormProvider>
    </form>
  );
};
