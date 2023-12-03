import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { products } from './seeder.data';
import { Product } from '../../../products/entities/product.entity';
import { Dictionary } from '@mikro-orm/core';

export class ProductSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    for (const product of products) {
      em.create(Product, {
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        user: context.user.id,
      });
    }
    console.log('✅ Seeded Test Products data');
  }
}
