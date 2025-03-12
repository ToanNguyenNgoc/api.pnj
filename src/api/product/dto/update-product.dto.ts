import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductItemDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  special_price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active: boolean;
}

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  category_id: number;

  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active: boolean;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  special_price: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  quantity: number;

  @ApiProperty({ default: [] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  media_ids: number[];

  @ApiProperty({
    type: [UpdateProductItemDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateProductItemDto)
  items: UpdateProductItemDto[];
}
