import type { UserApi } from '@pk/types/user.js';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, type Relation } from 'typeorm';
import { Base } from './Base.ts';
import { Calendar } from './Calendar.ts';
import { Event } from './Event.ts';
import { UserRole } from './UserRole.ts';

@Entity()
export class User extends Base implements UserApi {
  @OneToMany(
    () => Calendar,
    calendar => calendar.author,
  )
  calendars!: Relation<Calendar[]>;

  @Column('varchar', { nullable: false, unique: true })
  email!: string;

  @OneToMany(
    () => Event,
    event => event.author,
  )
  events!: Relation<Event[]>;

  @Column('varchar', { nullable: false })
  name!: string;

  @ManyToMany(
    () => UserRole,
    role => role.users,
  )
  @JoinTable()
  roles!: Relation<UserRole[]>;

  @Column('varchar', { nullable: false })
  surname!: string;
}
