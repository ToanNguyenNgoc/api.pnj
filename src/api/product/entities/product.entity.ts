import { BaseEntity } from 'src/commons';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ProductMedia } from './product.media.entity';
import { ProductItem } from './product.item.entity';
import { Category } from 'src/api/categories/entities';
import { OrderItem } from 'src/api/orders/entities';
import { Banner } from 'src/api/banners/entities';

@Entity('tb_product')
export class Product extends BaseEntity {
  static sortable = ['createdAt', '-createdAt', 'id', '-id', 'name', '-name'];
  static relations = ['medias', 'items', 'category'];

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  name_slugify: string;

  @OneToMany(() => ProductMedia, (productMedia) => productMedia.product)
  medias: ProductMedia[];

  @OneToMany(() => ProductItem, (productItem) => productItem.product)
  items: ProductItem[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true, default: 0 })
  price: number;

  @Column({ nullable: true, default: 0 })
  special_price: number;

  @Column({ nullable: true, default: 0 })
  quantity: number;

  //Relationship

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Banner, (banner) => banner.product)
  banners: Banner[];
}
