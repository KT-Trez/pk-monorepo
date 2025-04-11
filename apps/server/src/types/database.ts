import type { QueryConfig, QueryConfigValues, QueryResult, QueryResultRow } from 'pg';

export type QueryFunction = <R extends QueryResultRow = unknown[], I = unknown[]>(
  queryTextOrConfig: string | QueryConfig<I>,
  values?: QueryConfigValues<I>,
) => Promise<QueryResult<R>>;
