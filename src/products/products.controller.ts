import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpsertProductDto } from './dto/upsert-product.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/iam/authentication/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { SignEnum, SortEnum, SortOrderEnum } from './enums';
import { QueryParamsDto } from './dto/query-params.dto';

@ApiTags('Products')
@ApiBearerAuth('accessToken')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  upsert(
    @Body() createProductDto: UpsertProductDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.productsService.upsert(createProductDto, user.userId);
  }

  @Get()
  @ApiQuery({ name: 'priceSign', enum: SignEnum, required: false })
  @ApiQuery({ name: 'price', required: false })
  @ApiQuery({ name: 'quantitySign', enum: SignEnum, required: false })
  @ApiQuery({ name: 'quantity', required: false })
  @ApiQuery({ name: 'sortOrder', enum: SortOrderEnum, required: false })
  @ApiQuery({
    name: 'sortBy',
    enum: SortEnum,
    required: false,
  })
  @ApiQuery({ name: 'searchTerm', required: false })
  findAll(
    @Query('searchTerm') searchTerm?: string,
    @Query('price') price?: number,
    @Query('quantity') quantity?: number,
    @Query('priceSign') priceSign?: SignEnum,
    @Query('quantitySign') quantitySign?: SignEnum,
    @Query('sortBy') sortBy: SortEnum = SortEnum.ID,
    @Query('sortOrder') sortOrder: SortOrderEnum = SortOrderEnum.ASC,
  ) {
    return this.productsService.findAll(
      new QueryParamsDto(
        searchTerm,
        price,
        priceSign,
        quantity,
        quantitySign,
        sortBy,
        sortOrder,
      ),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    return this.productsService.remove(id, user.userId);
  }
}
