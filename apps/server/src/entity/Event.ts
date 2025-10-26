import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Calendar } from './Calendar.ts';
import { User } from './User.ts';

@Entity()
export class Event {
  @ManyToOne(
    () => User,
    user => user.events,
  )
  author!: User;

  @ManyToOne(
    () => Calendar,
    calendar => calendar.events,
  )
  calendar!: Calendar;

  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  createdAt!: string;

  @Column('varchar', { nullable: true })
  description!: string;

  @Column('timestamptz', { default: () => "(NOW() + '01:00:00'::INTERVAL)", nullable: false })
  endDateTime!: string;

  @Column('varchar', { nullable: false })
  location!: string;

  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  modifiedAt!: string;

  @Column('varchar', { nullable: false })
  name!: string;

  @Column('timestamptz', { default: () => 'NOW()', nullable: false })
  startDateTime!: string;

  @PrimaryGeneratedColumn('uuid')
  uid!: string;
}
