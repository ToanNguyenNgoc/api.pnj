import { District, Province, Ward } from 'src/api/provinces/entities';
import { User } from 'src/api/users/entities/user.entity';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

@Entity({ name: 'tb_user_address' })
export class UserAddress extends BaseEntity {
  @ManyToOne(() => User, (user) => user.addresses)
  user: User;

  @Column({ nullable: true })
  short_address: string;

  @Column({ default: false })
  is_default: boolean;

  @Column({ default: false })
  is_bookmark: boolean;

  @Column({ nullable: true })
  consignee_s_name: string;

  @Column({ nullable: true })
  consignee_s_telephone: string;

  @ManyToMany(() => Province)
  @JoinTable()
  province: Province[];

  @ManyToMany(() => District)
  @JoinTable()
  district: District[];

  @ManyToMany(() => Ward)
  @JoinTable()
  ward: Ward[];

  @Column({ nullable: true })
  lat: number;

  @Column({ nullable: true })
  long: number;
}
