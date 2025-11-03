import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Calendar } from './entity/Calendar.ts';
import { Event } from './entity/Event.ts';
import { User } from './entity/User.ts';
import { UserRole } from './entity/UserRole.ts';

export const AppDataSource = new DataSource({
  database: 'test',
  entities: [Calendar, Event, User, UserRole],
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
