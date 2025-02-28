import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/commons';
import { User } from '../entities/user.entity';

export class QueryUser extends BaseQuery {
  @ApiProperty({ required: false })
  active: boolean;

  @ApiProperty({ required: false, description: 'Role name' })
  role?: string;

  @ApiProperty({
    required: false,
    description: User.sortable.join(', '),
  })
  @IsOptional()
  @IsIn(User.sortable)
  sort?: string;
}
