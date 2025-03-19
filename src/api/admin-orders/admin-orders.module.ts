import { Module } from '@nestjs/common';
import { AdminOrdersController } from './admin-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Order,
  OrderDelivery,
  OrderItem,
  PaymentGateway,
} from '../orders/entities';
import { OrdersService } from '../orders/orders.service';
import { PaymentMethod } from '../payment-methods/entities';
import { Product, ProductItem } from '../product/entities';
import { UserAddress } from '../user-addresses/entities';
import { CalculateOrderHelper } from 'src/helpers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderDelivery,
      PaymentGateway,
      UserAddress,
      PaymentMethod,
      Product,
      ProductItem,
    ]),
  ],
  providers: [OrdersService, CalculateOrderHelper],
  controllers: [AdminOrdersController],
})
export class AdminOrdersModule {}
