import type { LoginFormDataIn } from '@/modules/login/validationSchema.ts';

export const defaultLoginFormValues: LoginFormDataIn = {
  email: '',
  password: '',
};
