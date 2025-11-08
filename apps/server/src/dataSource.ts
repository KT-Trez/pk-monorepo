import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Calendar } from './entity/Calendar.ts';
import { Event } from './entity/Event.ts';
import { Session } from './entity/Session.ts';
import { User } from './entity/User.ts';
import { UserAuth } from './entity/UserAuth.ts';
import { UserRole } from './entity/UserRole.ts';

export const AppDataSource = new DataSource({
  database: process.env.POSTGRES_DB,
  entities: [Calendar, Event, Session, User, UserAuth, UserRole],
  host: process.env.POSTGRES_HOST,
  logging: false,
  migrations: [],
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  subscribers: [],
  synchronize: true,
  type: 'postgres',
  username: process.env.POSTGRES_USER,
});
