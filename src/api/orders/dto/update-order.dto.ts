import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { Order } from '../entities';

export class UpdateOrderDto {
  @ApiProperty({ default: Order.STATUS.PENDING.name })
  @IsOptional()
  @IsIn(Object.keys(Order.STATUS))
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  payment_method_id: number;

  @ApiProperty()
  @IsOptional()
  note: string;
}
