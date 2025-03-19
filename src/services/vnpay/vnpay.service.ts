import moment from 'moment';
import { base64encode } from 'src/utils';
import * as querystring from 'qs';
import { createHmac } from 'crypto';
import { Repository } from 'typeorm';
import { Order, PaymentGateway } from 'src/api/orders/entities';
import { VnPayTransactionType } from 'src/types';
import { Response } from 'express';
import axios from 'axios';

export class VNPayService {
  private orderRepo: Repository<Order>;
  private paymentGatewayRepo: Repository<PaymentGateway>;
  private ipAddr = '::1';
  private locale = 'vn';
  private currCode = 'VND';
  private tmnCode = process.env.VNPAY_TMN_CODE;
  private secretKey = process.env.VNPAY_HASH_SECRET;
  private version = process.env.VNPAY_VERSION;
  private vnpayApiTransaction = process.env.VNPAY_API_TRANSACTION;
  constructor(
    orderRepo: Repository<Order>,
    paymentGatewayRepo: Repository<PaymentGateway>,
  ) {
    this.orderRepo = orderRepo;
    this.paymentGatewayRepo = paymentGatewayRepo;
  }
  sortObject = (obj: Record<string, any>): Record<string, any> => {
    const sorted: Record<string, any> = {};
    const keys = Object.keys(obj).sort();

    for (const key of keys) {
      sorted[key] = obj[key];
    }
    return sorted;
  };
  getCallbackUrl(orderId: string) {
    return `${process.env.VNPAY_CALLBACK_URL}?transaction_id=${orderId}`;
  }
  async createPaymentGateway(amount: number) {
    const createDate = moment().format('YYYYMMDDHHmmss');
    let vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;
    const orderId = base64encode(`${new Date().getTime()}`);
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = this.version;
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = this.tmnCode;
    vnp_Params['vnp_Locale'] = this.locale;
    vnp_Params['vnp_CurrCode'] = this.currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = this.ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_BankCode'] = 'VNBANK';
    vnp_Params = this.sortObject(vnp_Params);
    const signData = querystring.stringify(vnp_Params, { encode: true });
    const hmac = createHmac('sha512', this.secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });
    return this.paymentGatewayRepo.save(
      await this.paymentGatewayRepo.create({
        amount,
        transaction_id: orderId,
        payment_url: vnpUrl,
        callback_url: this.getCallbackUrl(orderId),
      }),
    );
  }
  async checkoutPaymentGateway(
    query: VnPayTransactionType,
    response: Response,
  ) {
    const { vnp_TxnRef, vnp_PayDate, vnp_Amount } = query;
    const vnp_RequestId = moment().format('HHmmss');
    const vnp_Command = 'querydr';
    const vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;
    const vnp_CreateDate = moment().format('YYYYMMDDHHmmss');
    const data =
      vnp_RequestId +
      '|' +
      this.version +
      '|' +
      vnp_Command +
      '|' +
      this.tmnCode +
      '|' +
      vnp_TxnRef +
      '|' +
      vnp_PayDate +
      '|' +
      vnp_CreateDate +
      '|' +
      this.ipAddr +
      '|' +
      vnp_OrderInfo;
    const hmac = createHmac('sha512', this.secretKey || '');
    const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');
    const dataObj = {
      vnp_RequestId: vnp_RequestId,
      vnp_Version: this.version,
      vnp_Command: vnp_Command,
      vnp_TmnCode: this.tmnCode,
      vnp_TxnRef: vnp_TxnRef,
      vnp_OrderInfo: vnp_OrderInfo,
      vnp_TransactionDate: vnp_PayDate,
      vnp_CreateDate: vnp_CreateDate,
      vnp_IpAddr: this.ipAddr,
      vnp_SecureHash: vnp_SecureHash,
    };
    const result = await axios.post(this.vnpayApiTransaction, dataObj);
    if (result.data.vnp_TransactionStatus == '00') {
      await this.updateOrder(
        vnp_TxnRef,
        Order.STATUS.PAID.name,
        Number(vnp_Amount || 0) / 100,
      );
    } else {
      await this.updateOrder(vnp_TxnRef, Order.STATUS.CANCELLED.name, 0);
    }
    return response.redirect(this.getCallbackUrl(query.vnp_TxnRef));
  }
  async updateOrder(vnp_TxnRef: string, status: string, amount: number) {
    this.paymentGatewayRepo.update(
      { transaction_id: vnp_TxnRef },
      {
        status,
        amount_paid: amount,
      },
    );
    const order = await this.orderRepo.findOne({
      where: { paymentGateway: { transaction_id: vnp_TxnRef } },
    });
    if (order) {
      order.status = status;
      this.orderRepo.save(order);
    }
  }
}
