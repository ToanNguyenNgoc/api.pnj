import { BaseEntity } from 'src/commons';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'tb_payment_method' })
export class PaymentMethod extends BaseEntity {
  static METHOD = {
    CODE: { name: 'Thanh toán khi nhận hàng' },
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
}
