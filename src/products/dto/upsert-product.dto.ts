import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpsertProductDto {
  @ApiProperty({
    name: 'id',
    description: 'Use it if you want to update an existing product',
    example: 'Use it only for bulk update.',
    required: false,
  })
  @IsOptional()
  id?: string;
  @ApiProperty({
    name: 'name',
    description: 'Product name',
    example: 'Product 1',
  })
  @IsNotEmpty({ message: 'Product name is required.' })
  name: string;

  @ApiProperty({
    name: 'description',
    description: 'Product description',
    example: 'This is an awesome product!',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    name: 'price',
    description: 'Product price',
    example: 1000,
  })
  @IsNotEmpty({ message: 'Product price is required.' })
  price: number;

  @ApiProperty({
    name: 'quantity',
    description: 'Product quantity',
    example: 1000,
  })
  @IsNotEmpty({ message: 'Product quantity is required.' })
  quantity: number;
}
