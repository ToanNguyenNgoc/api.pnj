import { Media } from 'src/api/media/entities';
import { Product } from 'src/api/product/entities';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('tb_brand')
export class Brand extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  name_slugify: string;

  @ManyToOne(() => Media, (media) => media.brands)
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
