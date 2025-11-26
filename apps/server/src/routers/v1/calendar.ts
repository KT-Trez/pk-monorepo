import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { AppDataSource } from '../../dataSource.ts';
import { Calendar } from '../../entity/Calendar.ts';
import { protectedProcedure, router } from '../../trpc.ts';

export const calendarRouter = router({
  calendarList: protectedProcedure.query(async ({ ctx }) => {
    const calendarRepository = AppDataSource.getRepository(Calendar);
    const calendars = await calendarRepository.find({ relations: { author: true } });

    return calendars.filter(calendar => ctx.session.hasPermission('calendar', 'read', calendar));
  }),
  createCalendar: protectedProcedure
    .input(
      z.object({
        isPublic: z.boolean().optional(),
        name: z
          .string()
          .min(1, { message: 'Name is required' })
          .max(255, { message: 'Name must be at most 255 characters long' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await AppDataSource.transaction('READ UNCOMMITTED', async entityManager => {
        const calendarRepository = entityManager.getRepository(Calendar);

        const newCalendar = Calendar.create({
          author: ctx.session.user,
          isPublic: input.isPublic,
          name: input.name,
        });

        if (!ctx.session.hasPermission('calendar', 'create', newCalendar)) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to create calendars' });
        }

        return calendarRepository.save(newCalendar);
      });
    }),
});
