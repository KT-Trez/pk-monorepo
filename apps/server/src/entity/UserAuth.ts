import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from './Base.ts';
import { User } from './User.ts';

@Entity()
export class UserAuth extends Base {
  @Column('bytea', { nullable: false })
  password!: Buffer;

  @Column('bytea', { nullable: false })
  salt!: Buffer;

  @OneToOne(() => User, { cascade: ['remove', 'update'] })
  @JoinColumn()
  user!: User;
}
