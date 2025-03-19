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
