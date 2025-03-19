import { OrderDelivery } from 'src/api/orders/entities';
import { Organization } from 'src/api/organizations/entities';
import { UserAddress } from 'src/api/user-addresses/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'tb_province' })
export class Province {
  @PrimaryColumn()
  code: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  division_type: string;

  @Column({ nullable: true })
  codename: string;

  @Column({ nullable: true })
  phone_code: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  //

  @OneToMany(() => OrderDelivery, (orderDelivery) => orderDelivery.province)
  orderDeliveries: OrderDelivery[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.province)
  userAddresses: UserAddress[];

  @OneToMany(() => Organization, (org) => org.province)
  organizations: Organization[];
}

@Entity({ name: 'tb_district' })
export class District {
  @PrimaryColumn()
  code: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  division_type: string;

  @Column({ nullable: true })
  codename: string;

  @Column({ nullable: true })
  province_code: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  //

  @OneToMany(() => OrderDelivery, (orderDelivery) => orderDelivery.district)
  orderDeliveries: OrderDelivery[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.district)
  userAddresses: UserAddress[];

  @OneToMany(() => Organization, (org) => org.district)
  organizations: Organization[];
}

@Entity({ name: 'tb_ward' })
export class Ward {
  @PrimaryColumn()
  code: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  division_type: string;

  @Column({ nullable: true })
  codename: string;

  @Column({ nullable: true })
  district_code: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @OneToMany(() => OrderDelivery, (orderDelivery) => orderDelivery.ward)
  orderDeliveries: OrderDelivery[];

  @OneToMany(() => UserAddress, (userAddress) => userAddress.ward)
  userAddresses: UserAddress[];

  @OneToMany(() => Organization, (org) => org.ward)
  organizations: Organization[];
}
