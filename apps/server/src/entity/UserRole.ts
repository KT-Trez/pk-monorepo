import { Column, Entity, ManyToMany, PrimaryColumn, type Relation } from 'typeorm';
import { User } from './User.ts';

@Entity()
export class UserRole {
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
