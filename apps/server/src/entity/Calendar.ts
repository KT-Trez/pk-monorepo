import type { CalendarApi } from '@pk/types/calendar.js';
import { Column, Entity, ManyToOne, OneToMany, type Relation } from 'typeorm';
import { Base } from './Base.ts';
import { Event } from './Event.ts';
import { User } from './User.ts';

type CalendarCreateOptions = {
  author: User;
  isPublic?: boolean;
  name: string;
};

@Entity()
export class Calendar extends Base implements CalendarApi {
  static create(data: CalendarCreateOptions) {
    const calendar = new Calendar();
    calendar.author = data.author;

    if (data.isPublic !== undefined) {
      calendar.isPublic = data.isPublic;
    }

    calendar.name = data.name;

    return calendar;
  }

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

  @Column('varchar', { nullable: false, unique: true })
  name!: string;
}
