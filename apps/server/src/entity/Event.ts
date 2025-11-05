import { Column, Entity, ManyToOne } from 'typeorm';
import { Base } from './Base.ts';
import { Calendar } from './Calendar.ts';
import { User } from './User.ts';

@Entity()
export class Event extends Base {
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

  @Column('varchar', { nullable: true })
  description!: string;

  @Column('timestamptz', { default: () => "(NOW() + '01:00:00'::INTERVAL)", nullable: false })
  endDateTime!: Date;

  @Column('varchar', { nullable: false })
  location!: string;

  @Column('varchar', { nullable: false })
  name!: string;

  @Column('timestamptz', { default: () => 'NOW()', nullable: false })
  startDateTime!: Date;
}
