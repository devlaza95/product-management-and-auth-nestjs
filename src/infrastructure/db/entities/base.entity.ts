import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  id: string = v4();

  @Property({ columnType: 'timestamp', name: 'createdAt' })
  createdAt: Date = new Date();

  @Property({
    columnType: 'timestamp',
    onUpdate: () => new Date(),
    name: 'updatedAt',
  })
  updatedAt: Date = new Date();

  @Property({ nullable: true, name: 'updatedBy' })
  updatedBy?: number;

  // For soft delete purposes
  @Property({ columnType: 'boolean', name: 'isActive' })
  isActive = true;
}
