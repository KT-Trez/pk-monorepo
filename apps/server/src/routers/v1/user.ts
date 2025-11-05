import { z } from 'zod';
import { AppDataSource } from '../../dataSource.ts';
import { User } from '../../entity/User.ts';
import { UserAuth } from '../../entity/UserAuth.ts';
import { protectedProcedure, router } from '../../trpc.ts';
import { HashUtilities } from '../../utils/Hash.ts';

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
    .mutation(async ({ input }) => {
      return await AppDataSource.transaction('READ UNCOMMITTED', async entityManager => {
        const userRepository = entityManager.getRepository(User);
        const userAuthRepository = entityManager.getRepository(UserAuth);

        const salt = HashUtilities.generateSalt();
        const passwordHash = await HashUtilities.hashPassword(input.password, salt);

        const newUser = new User();
        newUser.email = input.email;
        newUser.name = input.name;
        newUser.surname = input.surname;

        const newUserAuth = new UserAuth();
        newUserAuth.password = passwordHash;
        newUserAuth.salt = salt;
        newUserAuth.user = newUser;

        const user = await userRepository.save(newUser);
        await userAuthRepository.save(newUserAuth);

        return user;
      });
    }),
  userByUid: protectedProcedure.input(z.string()).query(({ input }) => {
    const userRepository = AppDataSource.getRepository(User);

    return userRepository.findOneBy({ uid: input });
  }),
  userList: protectedProcedure.query(() => {
    const userRepository = AppDataSource.getRepository(User);

    return userRepository.find();
  }),
});
