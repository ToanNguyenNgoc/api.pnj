import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { Order, PaymentGateway } from 'src/api/orders/entities';
import { StripeTransactionType } from 'src/types';
import { base64encode } from 'src/utils';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

export class StripeService {
  private orderRepo: Repository<Order>;
  private paymentGatewayRepo: Repository<PaymentGateway>;
  private stripe: Stripe;
  private STRIPE_API_KEY = process.env.STRIPE_API_KEY;
  private STRIPE_RETURN_URL = process.env.STRIPE_RETURN_URL;
  private STRIPE_CALLBACK_URL = process.env.STRIPE_CALLBACK_URL;
  private STRIPE_PM_STATUS_PAID = 'paid';
  private STRIPE_AMOUNT_MIN = Number(process.env.STRIPE_AMOUNT_MIN || 13000);
  constructor(
    orderRepo: Repository<Order>,
    paymentGatewayRepo: Repository<PaymentGateway>,
  ) {
    this.stripe = new Stripe(this.STRIPE_API_KEY);
    this.orderRepo = orderRepo;
    this.paymentGatewayRepo = paymentGatewayRepo;
  }
  getCallbackUrl(orderId: string) {
    return `${this.STRIPE_CALLBACK_URL}?transaction_id=${orderId}`;
  }
  async createSession(amount: number) {
    if (amount < this.STRIPE_AMOUNT_MIN) {
      throw new BadRequestException(
        `With payment method Stripe minimum order value: ${this.STRIPE_AMOUNT_MIN}`,
      );
    }
    const transaction_id = base64encode(`${new Date().getTime()}`);
    let paymentGateway: PaymentGateway;
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'vnd',
              product_data: {
                name: 'Order Payment',
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url:
          this.STRIPE_RETURN_URL + `?transaction_id=${transaction_id}`,
        cancel_url:
          this.STRIPE_RETURN_URL + `?transaction_id=${transaction_id}`,
        metadata: {},
      });
      if (session.id && session.url) {
        paymentGateway = await this.paymentGatewayRepo.save(
          await this.paymentGatewayRepo.create({
            amount,
            callback_url:
              this.STRIPE_CALLBACK_URL + `?transaction_id=${transaction_id}`,
            transaction_id,
            payment_url: session.url,
            payment_gateway_code: session.id,
            extra_data: JSON.stringify(session),
          }),
        );
      }
    } catch (error) {}
    return paymentGateway;
  }
  async checkoutSession(query: StripeTransactionType, response: Response) {
    try {
      const paymentGateway = await this.paymentGatewayRepo.findOneOrFail({
        where: { transaction_id: query.transaction_id },
      });
      const session = await this.stripe.checkout.sessions.retrieve(
        paymentGateway.payment_gateway_code,
      );
      if (session.payment_status === this.STRIPE_PM_STATUS_PAID) {
        this.updateOrder(
          query.transaction_id,
          Order.STATUS.PAID.name,
          paymentGateway.amount,
        );
      } else {
        this.updateOrder(query.transaction_id, Order.STATUS.CANCELLED.name, 0);
      }
    } catch (error) {
      this.updateOrder(query.transaction_id, Order.STATUS.CANCELLED.name, 0);
    }
    return response.redirect(this.getCallbackUrl(query.transaction_id));
  }
  async updateOrder(transaction_id: string, status: string, amount: number) {
    this.paymentGatewayRepo.update(
      { transaction_id },
      {
        status,
        amount_paid: amount,
      },
    );
    const order = await this.orderRepo.findOne({
      where: { paymentGateway: { transaction_id: transaction_id } },
    });
    if (order) {
      order.status = status;
      this.orderRepo.save(order);
    }
  }
}
