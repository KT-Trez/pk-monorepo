import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, type Relation } from 'typeorm';
import { Event } from './Event.ts';
import { User } from './User.ts';

@Entity()
export class Calendar {
  @ManyToOne(
    () => User,
    user => user.calendars,
  )
  author!: User;

  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  createdAt!: Date;

  @OneToMany(
    () => Event,
    event => event.calendar,
  )
  events!: Relation<Event[]>;

  @Column('boolean', { default: false, nullable: false })
  isPublic!: boolean;

  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  modifiedAt!: Date;

  @Column('varchar', { nullable: false })
  name!: string;

  @PrimaryGeneratedColumn('uuid')
  uid!: string;
}
