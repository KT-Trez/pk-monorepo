import pg from 'pg';

const { Client } = pg;

export const client = new Client({
  database: process.env.PG_DATABASE ?? 'pk',
  host: process.env.PG_HOST ?? 'localhost',
  password: process.env.PG_PASSWORD ?? '',
  port: process.env.PG_PORT ? Number.parseInt(process.env.PG_PORT) : 5432,
  user: process.env.PG_USER ?? 'pkserver',
});

// todo: add logger
client.connect().then(() => console.log('Connected'));
