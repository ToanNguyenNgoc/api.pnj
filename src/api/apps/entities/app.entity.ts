import { BaseEntity } from 'src/commons';
import { Column, Entity } from 'typeorm';

@Entity('tb_app')
export class AppEntity extends BaseEntity {
  @Column({ nullable: true })
  bundle: string;

  @Column({ nullable: true })
  version: string;

  @Column({ nullable: true })
  platform: string;

  @Column({ nullable: true })
  url: string;
}
