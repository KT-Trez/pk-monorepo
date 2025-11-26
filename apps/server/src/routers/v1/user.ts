import { UserRoleEnum } from '@pk/types/user.js';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { AppDataSource } from '../../dataSource.ts';
import { User } from '../../entity/User.ts';
import { UserAuth } from '../../entity/UserAuth.ts';
import { UserRole } from '../../entity/UserRole.ts';
import { protectedProcedure, router } from '../../trpc.ts';

export const userRouter = router({
  createUser: protectedProcedure
    .input(
      z.object({
        email: z.email({ message: 'Invalid email address' }),
        name: z
          .string()
          .min(1, { message: 'Name is required' })
          .max(255, { message: 'Name must be at most 255 characters long' }),
        password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
        surname: z
          .string()
          .min(1, { message: 'Surname is required' })
          .max(255, { message: 'Surname must be at most 255 characters long' }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await AppDataSource.transaction('READ UNCOMMITTED', async entityManager => {
        const userAuthRepository = entityManager.getRepository(UserAuth);
        const userRepository = entityManager.getRepository(User);
        const userRoleRepository = entityManager.getRepository(UserRole);

        const memberRole = await userRoleRepository.findOneByOrFail({ id: UserRoleEnum.Member });

        const newUser = User.create({
          email: input.email,
          name: input.name,
          roles: [memberRole],
          surname: input.surname,
        });

        if (!ctx.session.hasPermission('user', 'read', newUser)) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to create users' });
        }

        const newUserAuth = await UserAuth.create({ password: input.password, user: newUser });

        const user = await userRepository.save(newUser);
        await userAuthRepository.save(newUserAuth);

        return user;
      });
    }),
  userByUid: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ uid: input });

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    if (!ctx.session.hasPermission('user', 'read', user)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'You do not have permission to view this user' });
    }

    return user;
  }),
  userList: protectedProcedure.query(async ({ ctx }) => {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({ relations: { roles: true } });

    return users.filter(user => ctx.session.hasPermission('user', 'read', user));
  }),
});
