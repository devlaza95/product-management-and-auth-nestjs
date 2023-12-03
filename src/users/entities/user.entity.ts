import { Entity, Index, Property } from '@mikro-orm/core';
import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from '../../infrastructure/db/entities/base.entity';

@Entity({ tableName: 'users' })
export class User extends BaseEntity {
  @Property({ unique: true })
  @Index()
  @IsNotEmpty()
  email: string;

  @Property({ name: 'firstName' })
  @IsNotEmpty()
  firstName: string;

  @Property({ name: 'lastName' })
  @IsNotEmpty()
  lastName: string;

  @Property({ name: 'password' })
  @IsNotEmpty()
  password: string;

  @Property({ name: 'phone' })
  @IsNotEmpty()
  phone: string;
}
