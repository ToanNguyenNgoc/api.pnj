import { PaymentMethod } from 'src/api/payment-methods/entities';
import { Product, ProductItem } from 'src/api/product/entities';
import { User } from 'src/api/users/entities/user.entity';
import { BaseEntity } from 'src/commons';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { OrderDelivery } from './order-delivery.entity';
import { PaymentGateway } from './payment-gateway.entity';

@Entity({ name: 'tb_order' })
export class Order extends BaseEntity {
  static STATUS = {
    PENDING: { name: 'PENDING', description: 'đang xử lý' },
    PAID: { name: 'PAID', description: 'thành công' },
    CANCELLED: { name: 'CANCELLED', description: 'bị hủy' },
    CANCELLED_BY_USER: {
      name: 'CANCELLED_BY_USER',
      description: 'bị hủy bởi người dùng',
    },
    CANCELLED_BY_ADMIN: {
      name: 'CANCELLED_BY_ADMIN',
      description: 'bị hủy bởi quản lý',
    },
  };
  static getStatusArray() {
    return Object.entries(this.STATUS).map(([key, value]) => ({
      name: key,
      ...value,
    }));
  }
  static relations = [
    'items',
    'user',
    'orderDelivery',
    'paymentMethod',
    'paymentGateway',
  ];
  static sortable = [
    'createdAt',
    '-createdAt',
    'id',
    '-id',
    'amount',
    '-amount',
  ];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true, default: Order.STATUS.PENDING.name })
  status: string;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.orders)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true, default: 0 })
  amount: number;

  @Column({ nullable: true })
  note: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @OneToOne(() => OrderDelivery)
  @JoinColumn({ name: 'order_delivery_id' })
  orderDelivery: OrderDelivery;

  @OneToOne(() => PaymentGateway)
  @JoinColumn({ name: 'payment_gateway_id' })
  paymentGateway: PaymentGateway;
}

@Entity({ name: 'tb_order_item' })
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductItem, (productItem) => productItem.orderItems, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_item_id' })
  productItem: ProductItem;

  @Column({ nullable: true })
  product_name: string;

  @Column({ nullable: true })
  product_name_item: string;

  @Column({ nullable: true, default: 0 })
  base_price: number;

  @Column({ nullable: true, default: 0 })
  discount_value: number;

  @Column({ nullable: true, default: 0 })
  quantity: number;
}
