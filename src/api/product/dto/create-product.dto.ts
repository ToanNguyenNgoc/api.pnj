import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class ProductItemDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  special_price: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class CreateProductDto {
  @ApiProperty()
  category_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty({ default: [] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  media_ids: number[];

  @ApiProperty({
    type: [ProductItemDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  items: ProductItemDto[];
}
