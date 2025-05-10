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
import { BaseService } from '../web/BaseService.ts';

const { Pool } = pg;

type Query<I = unknown[]> = {
  queryTextOrConfig: string | QueryConfig<I>;
  values?: QueryConfigValues<I>;
};

type QueryOptions<I = unknown[]> = Query<I> & {
  tx?: PoolClient;
};

type TransactionOptions<I = unknown[]> = {
  queries: Query<I> | Query<I>[];
  tx?: PoolClient;
};

export class DatabaseService extends BaseService {
  static #instance: DatabaseService;

  #database: string;
  #host: string;
  #pool: IPool;
  #port: number;
  #user: string;

  constructor() {
    super();

    const database = process.env.PG_DATABASE ?? 'pk';
    const host = process.env.PG_HOST ?? 'localhost';
    const password = process.env.PG_PASSWORD ?? '';
    const port = process.env.PG_PORT ? Number.parseInt(process.env.PG_PORT) : 5432;
    const user = process.env.PG_USER ?? 'pk-admin'; // todo: change to pk-calendar-server

    this.#database = database;
    this.#host = host;
    this.#port = port;
    this.#user = user;

    this.#pool = new Pool({
      database,
      host,
      password,
      port,
      user,
    });
  }

  static get instance() {
    if (!DatabaseService.#instance) {
      DatabaseService.#instance = new DatabaseService();
    }

    return DatabaseService.#instance;
  }

  async asyncConstructor() {
    logger.log({ message: 'Connecting to database', severity: Severity.Info });
    this.#pool
      .connect()
      .then(() => {
        logger.log({
          message: `Connected to database "${this.#host}:${this.#port}" (${this.#database}") as "${this.#user}"`,
          severity: Severity.Success,
        });
      })
      .catch(err => {
        const message = err instanceof AggregateError ? err.errors.map(e => e.message).join(' | ') : err;
        logger.log({ message: `Error connecting to database: "${message}"`, severity: Severity.Fatal });
        process.exit(1);
      });

    return this;
  }

  queryRow = async <R extends QueryResultRow = unknown[], I = unknown[]>({
    queryTextOrConfig,
    values,
    tx,
  }: QueryOptions<I>): Promise<R | undefined> => {
    const queryResults = await this.transaction<R, I>({ queries: [{ queryTextOrConfig, values }], tx });
    const queryResult = queryResults.at(0);

    if (!queryResult) {
      throw new NotFoundError('query');
    }

    return queryResult.rows.at(0);
  };

  queryRows = async <R extends QueryResultRow = unknown[], I = unknown[]>({
    queryTextOrConfig,
    values,
    tx,
  }: QueryOptions<I>): Promise<R[]> => {
    const queryResults = await this.transaction<R, I>({ queries: [{ queryTextOrConfig, values }], tx });
    const queryResult = queryResults.at(0);

    if (!queryResult) {
      throw new NotFoundError('query');
    }

    return queryResult.rows;
  };

  async queryWithResult<R extends QueryResultRow = unknown[], I = unknown[]>({
    queryTextOrConfig,
    values,
    tx,
  }: QueryOptions<I>): Promise<QueryResult<R>> {
    const queryResults = await this.transaction<R, I>({ queries: [{ queryTextOrConfig, values }], tx });
    const queryResult = queryResults.at(0);

    if (!queryResult) {
      throw new NotFoundError('query');
    }

    return queryResult;
  }

  async transaction<R extends QueryResultRow = unknown[], I = unknown[]>({
    queries,
    tx,
  }: TransactionOptions<I>): Promise<QueryResult<R>[]> {
    const client = tx ? tx : await this.getTxClient();
    const statements = Array.isArray(queries) ? queries : [queries];

    try {
      const start = performance.now();

      if (!tx) {
        await client.query('BEGIN');
      }

      const promises = statements.map(({ queryTextOrConfig, values }) => client.query<R, I>(queryTextOrConfig, values));
      const queryResult = await Promise.all(promises);

      if (!tx) {
        await client.query('COMMIT');
      }

      const duration = performance.now() - start;

      logger.log({ env: 'DEBUG', message: `Queries executed in ${duration.toFixed(3)}ms`, severity: Severity.Debug });

      return queryResult;
    } catch (err) {
      if (!tx) {
        await client.query('ROLLBACK');
      }
      throw err;
    } finally {
      if (!tx) {
        client.release();
      }
    }
  }

  getTxClient() {
    return this.#pool.connect();
  }
}
