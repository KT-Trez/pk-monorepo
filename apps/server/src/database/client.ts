// import { Severity } from '@pk/utils/Logger/types.js';
// import pg, { type QueryConfig, type QueryConfigValues, type QueryResultRow } from 'pg';
// import { logger } from '../components/logger/logger.ts';
// import type { QueryFunction } from '../types/database.ts';
//
// const DATABASE_NAME = process.env.PG_DATABASE ?? 'pk';
// const DATABASE_PORT = process.env.PG_PORT ? Number.parseInt(process.env.PG_PORT) : 5432;
// const { Pool } = pg;
//
// const pool = new Pool({
//   database: DATABASE_NAME,
//   host: process.env.PG_HOST ?? 'localhost',
//   password: process.env.PG_PASSWORD ?? '',
//   port: DATABASE_PORT,
//   user: process.env.PG_USER ?? 'pkserver',
// });
//
// pool
//   .connect()
//   .then(() => {
//     logger.log({
//       message: `Connected to database: "${DATABASE_NAME}" on port: "${DATABASE_PORT}"`,
//       severity: Severity.Info,
//     });
//   })
//   .catch(err => {
//     const message = err instanceof AggregateError ? err.errors.map(e => e.message).join(' | ') : err;
//     logger.log({ message: `Error connecting to database: "${message}"`, severity: Severity.Fatal });
//     process.exit(1);
//   });
//
// export const query: QueryFunction = async <R extends QueryResultRow = unknown[], I = unknown[]>(
//   queryTextOrConfig: string | QueryConfig<I>,
//   values?: QueryConfigValues<I>,
// ) => {
//   const start = performance.now();
//   const queryResult = await pool.query<R, I>(queryTextOrConfig, values);
//   const duration = performance.now() - start;
//
//   logger.log({ message: `Query executed in ${duration.toFixed(3)}ms`, severity: Severity.Debug });
//
//   return queryResult;
// };
