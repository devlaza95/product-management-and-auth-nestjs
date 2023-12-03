import { SignEnum, SortEnum, SortOrderEnum } from '../enums';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  searchTerm?: string;
  @Transform(({ value }) => Number(value))
  @IsOptional()
  price?: number;
  @Transform(({ value }) => Number(value))
  @IsOptional()
  quantity?: number;
  @IsOptional()
  priceSign?: SignEnum;
  @IsOptional()
  quantitySign?: SignEnum;
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) {
      return SortEnum.ID;
    }
    return value;
  })
  sortBy?: SortEnum;
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) {
      return SortOrderEnum.ASC.toUpperCase();
    }
    return value.toUpperCase();
  })
  sortOrder?: SortOrderEnum;

  constructor(
    searchTerm?: string,
    price?: number,
    priceSign?: SignEnum,
    quantity?: number,
    quantitySign?: SignEnum,
    sortBy?: SortEnum,
    sortOrder?: SortOrderEnum,
  ) {
    this.searchTerm = searchTerm;
    this.price = price;
    this.quantity = quantity;
    this.priceSign = priceSign;
    this.quantitySign = quantitySign;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }
}
