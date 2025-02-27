import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/commons';

export class QrCategory extends BaseQuery {}
export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  media_id: number;
}

export class UpdateCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  media_id: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active: boolean;
}
