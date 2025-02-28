import { Media } from 'src/api/media/entities';
import { Product } from 'src/api/product/entities';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Entity('tb_category')
export class Category extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  name_slugify: string;

  @Column({ nullable: true, default: true })
  active: boolean;

  @OneToOne(() => Media)
  @JoinColumn()
  media: Media;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
