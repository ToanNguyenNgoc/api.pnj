import { BaseEntity } from 'src/commons';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'tb_payment_gateway' })
export class PaymentGateway extends BaseEntity {
  @Column({ nullable: true, default: 'PENDING' })
  status: string;

  @Column({ nullable: true, default: 0 })
  amount: number;

  @Column({ nullable: true, default: 0 })
  amount_paid: number;

  @Column({ nullable: true })
  transaction_id: string;

  @Column({ nullable: true, length: 1000 })
  payment_url: string;

  @Column({ nullable: true })
  callback_url: string;

  @Column({ nullable: true })
  payment_gateway_code: string;

  @Column({ nullable: true, length: 10000 })
  extra_data: string;
}
