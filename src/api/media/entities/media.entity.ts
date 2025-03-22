import { Banner } from 'src/api/banners/entities';
import { Blog } from 'src/api/blogs/entities';
import { Brand } from 'src/api/brands/entities';
import { Organization } from 'src/api/organizations/entities';
import { BaseEntity } from 'src/commons';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('tb_media')
export class Media extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  file_name: string;

  @Column({ nullable: true })
  mime_type: string;

  @Column({ nullable: true })
  size: number;

  @Column({ nullable: true })
  original_url: string;

  //
  @OneToMany(() => Organization, (organization) => organization.media)
  organizations: Organization[];

  @OneToMany(() => Banner, (banner) => banner.media)
  banners: Banner[];

  @OneToMany(() => Banner, (banner) => banner.thumbnailMedia)
  bannersThumbnail: Banner[];

  @OneToMany(() => Blog, (blog) => blog.media)
  blogs: Blog[];

  @OneToMany(() => Brand, (brand) => brand.media)
  brands: Brand[];
}
