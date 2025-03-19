import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Media } from 'src/api/media/entities';
import { BlogCategory } from 'src/api/blog-categories/entities';

@Entity('tb_blog')
export class Blog extends BaseEntity {
  @ManyToOne(() => BlogCategory, (category) => category.blogs)
  @JoinColumn({ name: 'category_id' })
  category: BlogCategory;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => Media, (media) => media.blogs)
  @JoinColumn({ name: 'media_id' })
  media: Media;
}
