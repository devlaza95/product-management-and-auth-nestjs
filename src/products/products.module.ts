import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/infrastructure/config/configuration';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Product, User]),
    ConfigModule.forFeature(configuration),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
