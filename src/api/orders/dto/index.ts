import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { BaseQuery } from 'src/commons';
import { Order, OrderDelivery } from '../entities';

export class OrderQuery extends BaseQuery {
  @ApiProperty({ required: false, enum: Object.keys(Order.STATUS) })
  @IsIn(Object.keys(Order.STATUS))
  @IsOptional()
  status: string;

  @ApiProperty({
    required: false,
    enum: Object.keys(OrderDelivery.DELIVERY_STATUS),
  })
  @IsIn(Object.keys(OrderDelivery.DELIVERY_STATUS))
  @IsOptional()
  delivery_status: string;

  @ApiProperty({
    required: false,
    description: `Example: ${Order.relations.join('|')}`,
  })
  includes: string;

  @ApiProperty({
    required: false,
    description: Order.sortable.join(', '),
  })
  @IsOptional()
  @IsIn(Order.sortable)
  sort?: string;
}

export class OrderItemDto {
  @ApiProperty({ default: 11 })
  @IsNumber()
  id: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsOptional()
  product_item_id: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  quantity: number;
}
export class UpdateOrderItemDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  quantity: number;
}
export class CreateOrderDto {
  @ApiProperty({ default: 1 })
  @IsNumber()
  payment_method_id: number;

  @ApiProperty()
  @IsOptional()
  note: string;

  @ApiProperty({
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  products: OrderItemDto[];

  @ApiProperty()
  @IsNumber()
  user_address_id: number;
}
