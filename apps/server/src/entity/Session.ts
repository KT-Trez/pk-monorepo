import type { SessionApi } from '@pk/types/session.js';
import { Column, Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { Base } from './Base.ts';
import { User } from './User.ts';

@Entity()
export class Session extends Base implements SessionApi {
  @Column('timestamptz', { default: () => "(NOW() + '23:59:00'::INTERVAL)", nullable: false })
  expiresAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  user!: Relation<User>;
}
