import { z } from 'zod';

export const loginFormValidationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Invalid password'),
});

export type LoginFormDataIn = z.input<typeof loginFormValidationSchema>;

export type LoginFormDataOut = z.output<typeof loginFormValidationSchema>;
