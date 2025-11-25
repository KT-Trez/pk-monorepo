import { Column, Entity, ManyToMany, PrimaryColumn, type Relation } from 'typeorm';
import { User } from './User.ts';

type UserRoleCreateOptions = {
  id: string;
  name: string;
};

@Entity()
export class UserRole {
  static create(data: UserRoleCreateOptions) {
    const userRole = new UserRole();
    userRole.id = data.id;
    userRole.name = data.name;

    return userRole;
  }

  @PrimaryColumn('varchar', { nullable: false })
  id!: string;

  @Column('varchar', { nullable: false })
  name!: string;

  @ManyToMany(
    () => User,
    user => user.roles,
  )
  users!: Relation<User[]>;
}
