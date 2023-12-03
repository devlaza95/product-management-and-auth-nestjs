import { Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseEntity } from '../../infrastructure/db/entities/base.entity';
import { User } from '../../users/entities/user.entity';
@Entity({ tableName: 'products' })
export class Product extends BaseEntity {
  @Property({ name: 'name' })
  @Index()
  @IsNotEmpty()
  name: string;

  @Property({ name: 'description', nullable: true })
  @IsOptional()
  description: string;

  @Property({ name: 'price' })
  @IsNotEmpty()
  price: number;

  @Property({ name: 'quantity', default: 0 })
  quantity: number;

  @ManyToOne(() => User, { name: 'owner', onDelete: 'cascade' })
  user: User;
}
