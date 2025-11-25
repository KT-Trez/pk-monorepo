import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { HashUtilities } from '../utils/Hash.ts';
import { Base } from './Base.ts';
import { User } from './User.ts';

type UserAuthCreateOptions = {
  password: string;
  user: User;
};

@Entity()
export class UserAuth extends Base {
  static async create(data: UserAuthCreateOptions) {
    const salt = HashUtilities.generateSalt();
    const passwordHash = await HashUtilities.hashPassword(data.password, salt);

    const userAuth = new UserAuth();
    userAuth.password = passwordHash;
    userAuth.salt = salt;
    userAuth.user = data.user;

    return userAuth;
  }

  @Column('bytea', { nullable: false })
  password!: Buffer;

  @Column('bytea', { nullable: false })
  salt!: Buffer;

  @OneToOne(() => User, { cascade: ['remove', 'update'] })
  @JoinColumn()
  user!: User;
}
