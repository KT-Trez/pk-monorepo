import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import type { Context } from './context.ts';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;

export const protectedProcedure = t.procedure.use(opts => {
  if (!opts.ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to access this resource' });
  }

  return opts.next({ ctx: { session: opts.ctx.session } });
});

export const publicProcedure = t.procedure;
