import type { BaseModelApi } from '@pk/types/model.js';
import { BeforeUpdate, Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Base implements BaseModelApi {
  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  createdAt!: Date;

  @Column('timestamp', { default: () => 'NOW()', nullable: false })
  modifiedAt!: Date;

  @BeforeUpdate()
  updateModifiedTimestamp() {
    this.modifiedAt = new Date();
  }

  @PrimaryGeneratedColumn('uuid')
  uid!: string;
}
