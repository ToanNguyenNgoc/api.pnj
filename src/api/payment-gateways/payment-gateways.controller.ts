import { Controller, Get, Injectable, Query, Response } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, PaymentGateway } from '../orders/entities';
import { Repository } from 'typeorm';
import { StripeService, VNPayService } from 'src/services';
import { StripeTransactionType, VnPayTransactionType } from 'src/types';
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
  private readonly StripeService = new StripeService(
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

  @Get('stripe-notification')
  @ApiExcludeEndpoint()
  StripeNotification(
    @Query() query: StripeTransactionType,
    @Response() response: ResponseExpress,
  ) {
    return this.StripeService.checkoutSession(query, response);
  }
}
