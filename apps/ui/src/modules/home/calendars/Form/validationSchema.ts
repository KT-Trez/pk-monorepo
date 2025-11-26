import { z } from 'zod';

export const calendarFormValidationSchema = z.object({
  isPublic: z.boolean(),
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Name must be at most 255 characters long' }),
});

export type CalendarFormDataIn = z.input<typeof calendarFormValidationSchema>;

export type CalendarFormDataOut = z.output<typeof calendarFormValidationSchema>;
