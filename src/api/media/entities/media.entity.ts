import { BaseEntity } from 'src/commons';
import { Column, Entity } from 'typeorm';

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
}
