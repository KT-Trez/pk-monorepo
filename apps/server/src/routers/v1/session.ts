import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { AppDataSource } from '../../dataSource.ts';
import { Session } from '../../entity/Session.ts';
import { User } from '../../entity/User.ts';
import { UserAuth } from '../../entity/UserAuth.ts';
import { publicProcedure, router } from '../../trpc.ts';
import { HashUtilities } from '../../utils/Hash.ts';

export const sessionRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const sessionRepository = AppDataSource.getRepository(Session);
      const userRepository = AppDataSource.getRepository(User);
      const userAuthRepository = AppDataSource.getRepository(UserAuth);

      const user = await userRepository.findOneBy({ email: input.email });

      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
      }

      const userAuth = await userAuthRepository.findOneBy({ user: { uid: user.uid } });

      if (!userAuth) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User data corrupted, please contact support' });
      }

      const passwordHash = await HashUtilities.hashPassword(input.password, userAuth.salt);

      if (!userAuth.password.equals(passwordHash)) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid email or password' });
      }

      const newSession = new Session();
      newSession.user = user;

      return await sessionRepository.save(newSession);
    }),
});
