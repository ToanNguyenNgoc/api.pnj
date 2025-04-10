import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrderDto } from './dto/update-order.dto';
import { BaseService, StripeService, VNPayService } from 'src/services';
import { Order, OrderItem, PaymentGateway } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalculateOrderHelper } from 'src/helpers';
import { jsonResponse } from 'src/commons';
import { User } from '../users/entities/user.entity';
import {
  CreateOrderDto,
  OrderItemDto,
  OrderQuery,
  UpdateOrderItemDto,
} from './dto';
import { PaymentMethod } from '../payment-methods/entities';

@Injectable()
export class OrdersService extends BaseService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(PaymentGateway)
    private readonly paymentGatewayRepo: Repository<PaymentGateway>,
    private readonly calculateOrderHelper: CalculateOrderHelper,
  ) {
    super(orderRepo);
  }
  async create(user: User, body: CreateOrderDto) {
    const { payment_method_id, note, products, user_address_id } = body;
    const paymentMethod = await this.calculateOrderHelper.onPaymentMethod(
      payment_method_id,
    );
    const orderDelivery = await this.calculateOrderHelper.onSaveDeliveryAddress(
      user.id,
      user_address_id,
    );
    const order = new Order();
    order.user = user;
    order.paymentMethod = paymentMethod;
    order.note = note;
    order.orderDelivery = orderDelivery;
    const orderResponse = await this.orderRepo.save(order);
    const { amount, orderItems } = await this.calculateOrderHelper.onProducts(
      orderResponse,
      products,
    );
    const paymentGateway = await this.onPaymentGateway(paymentMethod, amount);
    await this.orderRepo.update(
      { id: orderResponse.id },
      {
        amount,
        paymentGateway,
      },
    );
    await this.orderItemRepo.save(orderItems);
    return this.findOne(order.id);
  }
  async onPaymentGateway(paymentMethod: PaymentMethod, amount: number) {
    let paymentGateway: PaymentGateway;
    if (paymentMethod.method === PaymentMethod.METHOD.VNPAY_QR.key) {
      const vnPayService = new VNPayService(
        this.orderRepo,
        this.paymentGatewayRepo,
      );
      paymentGateway = await vnPayService.createPaymentGateway(amount);
    }
    if (paymentMethod.method === PaymentMethod.METHOD.STRIPE.key) {
      const stripeService = new StripeService(
        this.orderRepo,
        this.paymentGatewayRepo,
      );
      paymentGateway = await stripeService.createSession(amount);
    }
    return paymentGateway;
  }

  findAll(query: OrderQuery, user?: User) {
    const user_id = user?.id;
    return this.paginate(query, {
      where: {
        user: user_id
          ? { id: user_id }
          : [
              { fullname: this.getLike(query.search) },
              { telephone: this.getLike(query.search) },
              { email: this.getLike(query.search) },
            ],
        status: query.status,
        active: this.getBoolean(query.active),
        orderDelivery: { delivery_status: query.delivery_status },
      },
      order: this.getSort(query.sort),
      relations: {
        items: this.getIncludes('items', query.includes) && {
          product: true,
          productItem: true,
        },
        user: this.getIncludes('user', query.includes),
        orderDelivery: this.getIncludes('orderDelivery', query.includes) && {
          province: true,
          district: true,
          ward: true,
        },
        paymentGateway: this.getIncludes('paymentGateway', query.includes),
        paymentMethod: this.getIncludes('paymentMethod', query.includes),
      },
      select: { user: User.select },
    });
  }

  async findOne(id: number | string, user?: User) {
    const order = await this.orderRepo.findOne({
      where: [
        {
          id: !isNaN(Number(id)) ? Number(id) : 0,
          user: user ? { id: user.id } : null,
        },
        {
          paymentGateway: { transaction_id: String(id) },
          user: user ? { id: user.id } : null,
        },
      ],
      relations: {
        items: { product: true, productItem: true },
        user: true,
        paymentGateway: true,
        paymentMethod: true,
        orderDelivery: { province: true, district: true, ward: true },
      },
      select: { user: User.select },
    });
    if (!order) throw new NotFoundException();
    return jsonResponse(order);
  }

  async update(id: number, body: UpdateOrderDto) {
    const { status, payment_method_id, note } = body;
    await this.findAndUpdate(id, {
      status,
      note,
      paymentMethod: await this.calculateOrderHelper.onPaymentMethod(
        payment_method_id,
      ),
    });
    return this.findOne(id);
  }

  async postItem(id: number, body: OrderItemDto) {
    const order = await this.orderRepo.findOne({ where: { id } });
    const { amount, orderItems } = await this.calculateOrderHelper.onProducts(
      order,
      [body],
    );
    await this.orderItemRepo.save(orderItems);
    order.amount = order.amount + amount;
    await this.orderRepo.save(order);
    return this.findOne(order.id);
  }
  async updateItem(id: number, item_id: number, body: UpdateOrderItemDto) {
    const orderItem = await this.orderItemRepo.findOne({
      where: { order: { id }, id: item_id },
    });
    if (!orderItem) throw new NotFoundException();
    const base_price = orderItem.base_price;
    orderItem.base_price =
      (orderItem.base_price / orderItem.quantity) * body.quantity;
    orderItem.quantity = body.quantity;
    await this.orderItemRepo.save(orderItem);
    const order = await this.orderRepo.findOne({ where: { id } });
    order.amount = order.amount - base_price + orderItem.base_price;
    await this.orderRepo.save(order);
    return this.findOne(id);
  }
  async deleteItem(id: number, item_id: number) {
    const orderItem = await this.orderItemRepo.findOne({
      where: { order: { id }, id: item_id },
    });
    if (!orderItem) throw new NotFoundException();
    const order = await this.orderRepo.findOne({ where: { id } });
    order.amount = order.amount - orderItem.base_price;
    await this.orderRepo.save(order);
    await this.orderItemRepo.delete(item_id);
    return this.findOne(id);
  }
}
