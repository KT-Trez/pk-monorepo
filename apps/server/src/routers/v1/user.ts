import { z } from 'zod';
import { AppDataSource } from '../../data-source.ts';
import { User } from '../../entity/User.ts';
import { protectedProcedure, router } from '../../trpc.ts';

export const userRouter = router({
  userByUid: protectedProcedure.input(z.string()).query(({ input }) => {
    const userRepository = AppDataSource.getRepository(User);

    return userRepository.findOneBy({ uid: input });
  }),
  userList: protectedProcedure.query(() => {
    const userRepository = AppDataSource.getRepository(User);

    return userRepository.find();
  }),
});
