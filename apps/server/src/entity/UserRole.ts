import type { UserRoles } from '@pk/types/user.js';
import type { UserRoleApi } from '@pk/types/userRole.js';
import { Column, Entity, ManyToMany, PrimaryColumn, type Relation } from 'typeorm';
import { User } from './User.ts';

type UserRoleCreateOptions = {
  id: UserRoles;
  name: string;
};

@Entity()
export class UserRole implements UserRoleApi {
  static create(data: UserRoleCreateOptions) {
    const userRole = new UserRole();
    userRole.id = data.id;
    userRole.name = data.name;

    return userRole;
  }

  @PrimaryColumn('varchar', { nullable: false })
  id!: UserRoles;

  @Column('varchar', { nullable: false })
  name!: string;

  @ManyToMany(
    () => User,
    user => user.roles,
  )
  users!: Relation<User[]>;
}
