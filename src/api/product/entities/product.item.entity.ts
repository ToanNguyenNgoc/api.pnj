import { BaseEntity } from 'src/commons';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('tb_product_item')
export class ProductItem extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, default: 0 })
  price: number;

  @Column({ nullable: true })
  special_price: number;

  @Column({ nullable: true, default: 1 })
  quantity: number;

  @ManyToOne(() => Product, (product) => product.items)
  product: Product;
}
