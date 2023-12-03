import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpsertProductDto } from './dto/upsert-product.dto';
import { Product } from './entities/product.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from 'src/users/entities/user.entity';
import { QueryParamsDto } from './dto/query-params.dto';
import { SignEnum } from './enums';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: EntityRepository<Product>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async upsert(createProductDto: UpsertProductDto, userId: string) {
    const { name, description, price, quantity, id } = createProductDto;
    let ProductEntity: Product;
    let actionName = 'save';

    if (!id) {
      const user = await this.userRepository.findOne({ id: userId });
      ProductEntity = this.productsRepository.create({
        name,
        description,
        price,
        quantity,
        user,
      });
    } else {
      const existingProduct = await this.findOneForUser(id, userId);

      wrap(existingProduct).assign({
        name,
        description,
        price,
        quantity,
      });
      ProductEntity = existingProduct;
      actionName = 'update';
    }

    try {
      await this.productsRepository
        .getEntityManager()
        .persistAndFlush(ProductEntity);
      return ProductEntity;
    } catch (error) {
      throw new HttpException(
        `Failed to ${actionName} product to the database.`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async findAll(queryParams: QueryParamsDto) {
    const where: Record<string, any> = {};

    if (queryParams.price !== undefined && !isNaN(queryParams.price)) {
      where.price = this.buildPriceCondition(
        queryParams.price,
        queryParams.priceSign,
      );
    }

    if (queryParams.quantity !== undefined && !isNaN(queryParams.quantity)) {
      where.quantity = this.buildQuantityCondition(
        queryParams.quantity,
        queryParams.quantitySign,
      );
    }

    if (queryParams.searchTerm) {
      where.name = { $ilike: `%${queryParams.searchTerm}%` };
    }

    const products = await this.productsRepository.find(where, {
      orderBy: {
        [queryParams.sortBy]: queryParams.sortOrder,
      },
    });

    return products;
  }

  private buildPriceCondition(
    price: number,
    sign: SignEnum,
  ): Record<string, any> {
    switch (sign) {
      case SignEnum.GREATER_THAN:
        return { $gt: price };
      case SignEnum.LESS_THAN:
        return { $lt: price };
      default:
        return { $eq: price };
    }
  }

  private buildQuantityCondition(
    quantity: number,
    sign: SignEnum,
  ): Record<string, any> {
    switch (sign) {
      case SignEnum.GREATER_THAN:
        return { $gt: quantity };
      case SignEnum.LESS_THAN:
        return { $lt: quantity };
      default:
        return { $eq: quantity };
    }
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ id });
    return product;
  }

  async findOneForUser(id: string, userId: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      $and: [{ id }, { user: userId }],
    });

    if (!product) {
      throw new NotFoundException(
        'Product with the specified id not found for this user.',
      );
    }

    return product;
  }

  async remove(id: string, userId: string) {
    const product = await this.findOneForUser(id, userId);

    try {
      await this.productsRepository.getEntityManager().remove(product).flush();
    } catch (error) {
      throw new HttpException(
        `Failed to delete product from the database.`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
