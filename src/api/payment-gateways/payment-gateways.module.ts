import { Module } from '@nestjs/common';
import { PaymentGatewaysService } from './payment-gateways.service';
import { PaymentGatewaysController } from './payment-gateways.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, PaymentGateway } from '../orders/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PaymentGateway])],
  controllers: [PaymentGatewaysController],
  providers: [PaymentGatewaysService],
})
export class PaymentGatewaysModule {}
