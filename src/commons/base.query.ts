import { ApiProperty } from '@nestjs/swagger';

export class BaseQuery {
  @ApiProperty({ required: false, default: 1 })
  readonly page?: number;
  @ApiProperty({ required: false, default: 15 })
  readonly limit?: number;
  @ApiProperty({ required: false })
  readonly search?: string;
  @ApiProperty({ required: false })
  active?: boolean;
}
