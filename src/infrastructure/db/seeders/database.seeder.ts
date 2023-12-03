import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { ProductSeeder } from './product.seeder';
import { AuthSeeder } from './auth.seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [AuthSeeder, ProductSeeder]);
  }
}
