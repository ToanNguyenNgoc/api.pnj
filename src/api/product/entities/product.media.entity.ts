import { Media } from 'src/api/media/entities';
import { BaseEntity } from 'src/commons';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity('tb_product_media')
export class ProductMedia extends BaseEntity {
  @OneToOne(() => Media)
  @JoinColumn()
  media: Media;

  @ManyToOne(() => Product, (product) => product.medias)
  product: Product;
}
