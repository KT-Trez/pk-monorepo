import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Calendar } from './Calendar.ts';
import { Event } from './Event.ts';
import { UserRole } from './UserRole.ts';

@Entity()
export class User {
  @OneToMany(
    () => Calendar,
    calendar => calendar.author,
  )
  calendars!: Relation<Calendar[]>;

  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  createdAt!: Date;

  @Column('varchar', { nullable: false })
  email!: string;

  @OneToMany(
    () => Event,
    event => event.author,
  )
  events!: Relation<Event[]>;

  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  modifiedAt!: Date;

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

  @PrimaryGeneratedColumn('uuid')
  uid!: string;
}
