import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderDelivery, OrderItem, PaymentGateway } from './entities';
import { UserAddress } from '../user-addresses/entities';
import { PaymentMethod } from '../payment-methods/entities';
import { CalculateOrderHelper } from 'src/helpers';
import { Product, ProductItem } from '../product/entities';
import { OrdersStatusController } from './orders-status.controller';

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
  controllers: [OrdersStatusController, OrdersController],
  providers: [OrdersService, CalculateOrderHelper],
})
export class OrdersModule {}
