import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  createdAt!: Date;

  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  modifiedAt!: Date;

  @Column('varchar', { nullable: false })
  name!: string;

  @Column('varchar', { nullable: false })
  surname!: string;

  @PrimaryGeneratedColumn('uuid')
  uid!: string;
}
