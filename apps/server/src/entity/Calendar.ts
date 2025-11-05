import { Column, Entity, ManyToOne, OneToMany, type Relation } from 'typeorm';
import { Base } from './Base.ts';
import { Event } from './Event.ts';
import { User } from './User.ts';

@Entity()
export class Calendar extends Base {
  @ManyToOne(
    () => User,
    user => user.calendars,
  )
  author!: User;

  @OneToMany(
    () => Event,
    event => event.calendar,
  )
  events!: Relation<Event[]>;

  @Column('boolean', { default: false, nullable: false })
  isPublic!: boolean;

  @Column('varchar', { nullable: false })
  name!: string;
}
