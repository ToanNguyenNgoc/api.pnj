import { ApiProperty } from '@nestjs/swagger';
import { BaseQuery } from 'src/commons';
import { Product } from '../entities';
import { IsIn, IsOptional } from 'class-validator';

export class QrProductDto extends BaseQuery {
  @ApiProperty({ required: false })
  category_id?: number;

  @ApiProperty({ required: false })
  brand_id?: number;

  @ApiProperty({ required: false })
  min_special_price?: number;

  @ApiProperty({ required: false })
  max_special_price?: number;

  @ApiProperty({
    required: false,
    description: `Example: ${Product.relations.join('|')}`,
  })
  @IsOptional()
  includes?: string;

  @ApiProperty({
    required: false,
    description: Product.sortable.join(', '),
  })
  @IsOptional()
  @IsIn(Product.sortable)
  sort?: string;
}
