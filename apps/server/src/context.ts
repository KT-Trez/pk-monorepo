import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { AppDataSource } from './dataSource.ts';
import { Session } from './entity/Session.ts';

export const createContext = async (opts: CreateHTTPContextOptions) => {
  const authorization = opts.req.headers.authorization ?? '';
  const token = authorization.split(' ').at(1);

  if (!token) {
    return {
      session: null,
    };
  }

  const sessionRepository = AppDataSource.getRepository(Session);

  return {
    session: await sessionRepository.findOneBy({ uid: token }),
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
