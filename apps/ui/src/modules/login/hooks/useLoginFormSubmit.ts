import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import type { LoginFormDataIn } from '@/modules/login/validationSchema.ts';
import { useAuth } from '../../../components/AuthProvider/useAuth.ts';

export const useLoginFormSubmit = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { backTo } = useSearch({ from: '/login' });

  const handler = useCallback<SubmitHandler<LoginFormDataIn>>(
    async formData => {
      await login(formData.email, formData.password);
      await navigate({ to: backTo || '/home/events' });
    },
    [backTo, login, navigate],
  );

  return {
    handler,
  };
};
