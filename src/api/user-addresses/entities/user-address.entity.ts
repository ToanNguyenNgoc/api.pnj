import { OrderDelivery } from 'src/api/orders/entities';
import { District, Province, Ward } from 'src/api/provinces/entities';
import { User } from 'src/api/users/entities/user.entity';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

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

  @ManyToOne(() => Province, (province) => province.userAddresses)
  @JoinColumn({ name: 'province_code' })
  province: Province;

  @ManyToOne(() => District, (district) => district.userAddresses)
  @JoinColumn({ name: 'district_code' })
  district: District;

  @ManyToOne(() => Ward, (ward) => ward.userAddresses)
  @JoinColumn({ name: 'ward_code' })
  ward: Ward;

  @Column({ nullable: true })
  lat: number;

  @Column({ nullable: true })
  long: number;

  @OneToMany(() => OrderDelivery, (orderDelivery) => orderDelivery.userAddress)
  orderDeliveries: OrderDelivery[];
}
