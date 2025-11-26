import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import type { EmptyObject } from 'type-fest';
import { FormSections } from '../../../../components/Form/FormSections.tsx';
import { calendarFormDefaultValues } from './constants.ts';
import { useCalendarFormSubmit } from './hooks/useCalendarFormSubmit.ts';
import { DetailsSection } from './sections/DetailsSection.tsx';
import { type CalendarFormDataIn, type CalendarFormDataOut, calendarFormValidationSchema } from './validationSchema.ts';

export const CalendarForm = () => {
  const methods = useForm<CalendarFormDataIn, EmptyObject, CalendarFormDataOut>({
    defaultValues: calendarFormDefaultValues,
    mode: 'onTouched',
    resolver: zodResolver(calendarFormValidationSchema),
  });

  const { handler } = useCalendarFormSubmit();

  return (
    <form className="h-full" onSubmit={methods.handleSubmit(handler)}>
      <FormProvider {...methods}>
        <FormSections onCancel={{ to: '/home/calendars' }}>
          <DetailsSection />
        </FormSections>
      </FormProvider>
    </form>
  );
};
