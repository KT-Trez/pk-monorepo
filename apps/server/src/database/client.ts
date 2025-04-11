import pg, { type QueryConfig, type QueryConfigValues, type QueryResultRow } from 'pg';
import type { QueryFunction } from '../types/database.js';

const { Pool } = pg;

const pool = new Pool({
  database: process.env.PG_DATABASE ?? 'pk',
  host: process.env.PG_HOST ?? 'localhost',
  password: process.env.PG_PASSWORD ?? '',
  port: process.env.PG_PORT ? Number.parseInt(process.env.PG_PORT) : 5432,
  user: process.env.PG_USER ?? 'pkserver',
});

// todo: add logger
pool.connect().then(() => console.log('Connected'));

export const query: QueryFunction = async <R extends QueryResultRow = unknown[], I = unknown[]>(
  queryTextOrConfig: string | QueryConfig<I>,
  values?: QueryConfigValues<I>,
) => {
  const start = performance.now();
  const queryResult = await pool.query<R, I>(queryTextOrConfig, values);
  const duration = performance.now() - start;

  // todo: add logger
  console.info(`Query took ${duration}ms`);

  return queryResult;
};
