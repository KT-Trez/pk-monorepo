import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';
import type { SeederOptions } from 'typeorm-extension';
import UserRoleSeeder from './database/seeds/UserRoleSeeder.ts';
import UserSeeder from './database/seeds/UserSeeder.ts';
import { Calendar } from './entity/Calendar.ts';
import { Event } from './entity/Event.ts';
import { Session } from './entity/Session.ts';
import { User } from './entity/User.ts';
import { UserAuth } from './entity/UserAuth.ts';
import { UserRole } from './entity/UserRole.ts';

const options: DataSourceOptions & SeederOptions = {
  database: process.env.POSTGRES_DB,
  entities: [Calendar, Event, Session, User, UserAuth, UserRole],
  host: process.env.POSTGRES_HOST,
  logging: false,
  migrations: [],
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  seeds: [UserRoleSeeder, UserSeeder],
  subscribers: [],
  synchronize: true,
  type: 'postgres',
  username: process.env.POSTGRES_USER,
};

export const AppDataSource = new DataSource(options);
