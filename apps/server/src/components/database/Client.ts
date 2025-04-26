import { Severity } from '@pk/utils/Logger/types.js';
import pg, {
  type Pool as IPool,
  type PoolClient,
  type QueryConfig,
  type QueryConfigValues,
  type QueryResult,
  type QueryResultRow,
} from 'pg';
import { logger } from '../logger/logger.ts';
import { NotFoundError } from '../response/NotFoundError.ts';
import { ObjectNotFound } from '../response/ObjectNotFound.ts';

const { Pool } = pg;

type Query<I = unknown[]> = {
  queryTextOrConfig: string | QueryConfig<I>;
  values?: QueryConfigValues<I>;
};

type QueryOptions<I = unknown[]> = Query<I> & {
  tx?: PoolClient;
};

type QueryRowOptions<I = unknown[]> = Query<I> & {
  resource: string;
  tx?: PoolClient;
  uid: string;
};

type QueryWithStatementsOptions<I = unknown[]> = TransactionOptions<I>;

type TransactionOptions<I = unknown[]> = {
  autocommit?: boolean;
  queries: Query<I> | Query<I>[];
  tx?: PoolClient;
};

export class Client {
  static #instance: Client;
  #pool: IPool;

  constructor() {
    const database = process.env.PG_DATABASE ?? 'pk';
    const host = process.env.PG_HOST ?? 'localhost';
    const password = process.env.PG_PASSWORD ?? '';
    const port = process.env.PG_PORT ? Number.parseInt(process.env.PG_PORT) : 5432;
    const user = process.env.PG_USER ?? 'pkserver';

    this.#pool = new Pool({
      database,
      host,
      password,
      port,
      user,
    });

    this.#pool
        .connect()
        .then(() => {
          logger.log({
            message: `Connected to database: "${database}" on port: "${port}"`,
            severity: Severity.Info,
          });
        })
        .catch(err => {
          const message = err instanceof AggregateError ? err.errors.map(e => e.message).join(' | ') : err;
          logger.log({ message: `Error connecting to database: "${message}"`, severity: Severity.Fatal });
          process.exit(1);
        });
  }

  static get instance(): Client {
    if (!Client.#instance) {
      Client.#instance = new Client();
    }

    return Client.#instance;
  }

  async query<R extends QueryResultRow = unknown[], I = unknown[]>({
    queryTextOrConfig,
    values,
    tx,
  }: QueryOptions<I>): Promise<QueryResult<R>> {
    const queryResults = await this.#transaction<R, I>({ queries: [{ queryTextOrConfig, values }], tx });
    const queryResult = queryResults.at(0);

    if (!queryResult) {
      throw new NotFoundError('query');
    }

    return queryResult;
  }

  queryRow = async <R extends QueryResultRow = unknown[], I = unknown[]>({
    queryTextOrConfig,
    values,
    resource,
    tx,
    uid,
  }: QueryRowOptions<I>): Promise<R> => {
    const queryResults = await this.#transaction<R, I>({ queries: [{ queryTextOrConfig, values }], tx });
    const queryResult = queryResults.at(0);

    if (!queryResult) {
      throw new NotFoundError('query');
    }

    const row = queryResult.rows.at(0);

    if (!row) {
      throw new ObjectNotFound(resource, uid);
    }

    return row;
  };

  queryRows = async <R extends QueryResultRow = unknown[], I = unknown[]>({
    queryTextOrConfig,
    values,
    tx,
  }: QueryOptions<I>): Promise<R[]> => {
    const queryResults = await this.#transaction<R, I>({ queries: [{ queryTextOrConfig, values }], tx });
    const queryResult = queryResults.at(0);

    if (!queryResult) {
      throw new NotFoundError('query');
    }

    return queryResult.rows;
  };

  queryWithStatements<R extends QueryResultRow = unknown[], I = unknown[]>({
    queries,
    tx,
  }: QueryWithStatementsOptions<I>): Promise<QueryResult<R>[]> {
    return this.#transaction<R, I>({ queries, tx });
  }

  async #transaction<R extends QueryResultRow = unknown[], I = unknown[]>({
    autocommit = true,
    queries,
    tx,
  }: TransactionOptions<I>): Promise<QueryResult<R>[]> {
    const client = await this.#getTxClient(tx);
    const statements = Array.isArray(queries) ? queries : [queries];

    try {
      const start = performance.now();

      await client.query('BEGIN');

      const promises = statements.map(({ queryTextOrConfig, values }) => client.query<R, I>(queryTextOrConfig, values));
      const queryResult = await Promise.all(promises);

      if (autocommit) {
        await client.query('COMMIT');
      }

      const duration = performance.now() - start;

      logger.log({ message: `Queries executed in ${duration.toFixed(3)}ms`, severity: Severity.Debug });

      return queryResult;
    } catch (err) {
      // biome-ignore lint/complexity/noUselessCatch: the caller should handle the actual error
      throw err;
    } finally {
      client.release();
    }
  }

  #getTxClient(tx?: PoolClient) {
    if (tx) {
      return tx;
    }

    return this.#pool.connect();
  }
}
