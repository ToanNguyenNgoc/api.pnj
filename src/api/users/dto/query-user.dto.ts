import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/commons';

const sortable = [
  'createdAt',
  '-createdAt',
  'id',
  '-id',
  'fullname',
  '-fullname',
];

export class QueryUser extends BaseQuery {
  @ApiProperty({ required: false })
  active: boolean;

  @ApiProperty({ required: false, description: 'Role name' })
  role?: string;

  @ApiProperty({
    required: false,
    description: sortable.join(', '),
  })
  @IsOptional()
  @IsIn(sortable)
  sort?: string;
}
