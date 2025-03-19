import { Controller, Get, Injectable, Query, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, PaymentGateway } from '../orders/entities';
import { Repository } from 'typeorm';
import { VNPayService } from 'src/services';
import { VnPayTransactionType } from 'src/types';
import { Response as ResponseExpress } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('payment-gateways')
@Injectable()
export class PaymentGatewaysController {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(PaymentGateway)
    private readonly paymentGatewayRepo: Repository<PaymentGateway>,
  ) {}
  private readonly VNPayService = new VNPayService(
    this.orderRepo,
    this.paymentGatewayRepo,
  );
  @Get('vnpay-notification')
  @ApiExcludeEndpoint()
  VNPayNotification(
    @Query() query: VnPayTransactionType,
    @Response() response: ResponseExpress,
  ) {
    return this.VNPayService.checkoutPaymentGateway(query, response);
  }
}
