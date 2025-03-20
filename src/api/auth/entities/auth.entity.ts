import { BaseEntity } from 'src/commons';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export class Auth {}
@Entity('tb_refresh')
export class Refresh {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false, length: 1000 })
  refresh: string;
}
@Entity('tb_otp')
export class Otp extends BaseEntity {
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  expired_at: Date;
}
