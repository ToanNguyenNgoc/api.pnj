import { Media } from 'src/api/media/entities';
import { Product } from 'src/api/product/entities';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('tb_banner')
export class Banner extends BaseEntity {
  static TYPE = {
    WEB: { value: 'WEB' },
    HTML: { value: 'HTML' },
    VIDEO: { value: 'VIDEO' },
    PRODUCT: { value: 'PRODUCT' },
    // DISCOUNT: { value: 'DISCOUNT' },
    POPUP: { value: 'POPUP' },
  };

  static relations = ['product', 'media', 'thumbnailMedia'];
  static sortable = [
    'id',
    '-id',
    'name',
    '-name',
    'priority',
    '-priority',
    'createdAt',
    '-createdAt',
  ];

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => Media, (media) => media.banners)
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => Product, (product) => product.banners)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Media, (media) => media.bannersThumbnail)
  @JoinColumn({ name: 'thumbnail_media_id' })
  thumbnailMedia: Media;

  @Column({ nullable: true, default: 0 })
  priority: number;

  @Column({ nullable: true })
  expires_at: Date;
}
