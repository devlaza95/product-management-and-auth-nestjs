import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from '../../../users/entities/user.entity';
import { genSalt, hash } from 'bcrypt';
import { Dictionary } from '@mikro-orm/core';

export class AuthSeeder extends Seeder {
  async run(em: EntityManager, context: Dictionary): Promise<void> {
    const salt = await genSalt(12);
    const password = await hash('ASDasd123!!!!', salt);
    const userEntity = em.create(User, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.com',
      password,
      phone: '+1 222 222 222',
    });
    context.user = userEntity;
    await em.persistAndFlush(userEntity);
    console.log('✅ Seeded Test User data');
  }
}
