import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/commons';
import { Banner } from '../entities';

export class QrBanner extends BaseQuery {
  @ApiProperty({
    required: false,
    enum: Object.keys(Banner.TYPE),
  })
  @IsIn(Object.keys(Banner.TYPE))
  @IsOptional()
  type: string;

  @ApiProperty({
    required: false,
    description: `Example: ${Banner.relations.join('|')}`,
  })
  includes: string;

  @ApiProperty({
    required: false,
    description: Banner.sortable.join(', '),
  })
  @IsOptional()
  @IsIn(Banner.sortable)
  sort?: string;

  @ApiProperty({ required: false })
  all?: boolean;
}
