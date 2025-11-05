import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import type { EmptyObject } from 'type-fest';
import { defaultLoginFormValues } from '@/modules/login/constants.ts';
import { useLoginFormSubmit } from '@/modules/login/hooks/useLoginFormSubmit.ts';
import {
  type LoginFormDataIn,
  type LoginFormDataOut,
  loginFormValidationSchema,
} from '@/modules/login/validationSchema.ts';
import { MainSection } from './sections/MainSection.tsx';

export const LoginForm = () => {
  const methods = useForm<LoginFormDataIn, EmptyObject, LoginFormDataOut>({
    defaultValues: defaultLoginFormValues,
    mode: 'onTouched',
    resolver: zodResolver(loginFormValidationSchema),
  });

  const { handler } = useLoginFormSubmit();

  return (
    <form className="w-full" onSubmit={methods.handleSubmit(handler)}>
      <FormProvider {...methods}>
        <MainSection />
      </FormProvider>
    </form>
  );
};
