import { Blog } from 'src/api/blogs/entities';
import { BaseEntity } from 'src/commons';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('tb_blog_category')
export class BlogCategory extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  name_slugify: string;

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs: Blog[];
}
