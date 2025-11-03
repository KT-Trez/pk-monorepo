import { z } from 'zod';
import { AppDataSource } from '../../dataSource.ts';
import { User } from '../../entity/User.ts';
import { publicProcedure, router } from '../../trpc.ts';

export const userRouter = router({
  userByUid: publicProcedure.input(z.string()).query(({ input }) => {
    const userRepository = AppDataSource.getRepository(User);

    return userRepository.findOneBy({ uid: input });
  }),
  userList: publicProcedure.query(() => {
    const userRepository = AppDataSource.getRepository(User);

    return userRepository.find();
  }),
});
