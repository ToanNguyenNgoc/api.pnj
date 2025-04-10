import { Order } from 'src/api/orders/entities';
import { BaseEntity } from 'src/commons';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'tb_payment_method' })
export class PaymentMethod extends BaseEntity {
  static METHOD = {
    COD: { key: 'COD', bank_code: '', name: 'Thanh toán khi nhận hàng' },
    VNPAY_QR: { key: 'VNPAY', bank_code: 'VNPAYQR', name: 'VNPay QR Code' },
    VNPAY_BANK: { key: 'VNPAY', bank_code: 'VNBANK', name: 'VNPay ngân hàng' },
    VNPAY_CARD: { key: 'VNPAY', bank_code: 'INTCARD', name: 'Thẻ ghi nợ' },
    STRIPE: {
      key: 'STRIPE',
      bank_code: 'STRIPE',
      name: 'Thanh toán qua Stripe',
    },
  };
  static toMethodArray() {
    return Object.entries(this.METHOD).map(([key, value]) => ({
      method: key,
      ...value,
    }));
  }

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  method: string;

  @Column({ nullable: true })
  bank_code: string;

  @OneToMany(() => Order, (order) => order.paymentMethod)
  orders: Order[];
}
