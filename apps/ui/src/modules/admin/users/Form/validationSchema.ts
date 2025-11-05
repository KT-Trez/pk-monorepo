import { z } from 'zod';

export const userFormValidationSchema = z
  .object({
    // album: z.number().min(1, { message: 'Album is required' }),
    email: z.email({ message: 'Invalid email address' }),
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(255, { message: 'Name must be at most 255 characters long' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
    passwordConfirmation: z.string(),
    surname: z
      .string()
      .min(1, { message: 'Surname is required' })
      .max(255, { message: 'Surname must be at most 255 characters long' }),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

export type UserFormDataIn = z.input<typeof userFormValidationSchema>;

export type UserFormDataOut = z.output<typeof userFormValidationSchema>;
