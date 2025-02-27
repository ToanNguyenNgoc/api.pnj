import { Media } from 'src/api/media/entities';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

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
}
