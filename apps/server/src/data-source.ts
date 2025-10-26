import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User.js';

export const AppDataSource = new DataSource({
  database: 'test',
  entities: [User],
  host: 'localhost',
  logging: false,
  migrations: [],
  password: 'test',
  port: 5432,
  subscribers: [],
  synchronize: true,
  type: 'postgres',
  username: 'test',
});
