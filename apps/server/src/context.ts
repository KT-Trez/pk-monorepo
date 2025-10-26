import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';

export const createContext = (opts: CreateHTTPContextOptions) => {
  // const session = await getSession({ req: opts.req });

  return {
    session: null,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
