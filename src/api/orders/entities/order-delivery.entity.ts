import { Province, District, Ward } from 'src/api/provinces/entities';
import { UserAddress } from 'src/api/user-addresses/entities';
import { BaseEntity } from 'src/commons';
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity({ name: 'tb_order_delivery' })
export class OrderDelivery extends BaseEntity {
  static DELIVERY_STATUS = {
    INIT: { description: 'khởi tạo' },
    PICK_UP: { description: 'lấy hàng' },
    ON_DELIVERY: { description: 'đang giao hàng' },
    SUCCESSFUL: { description: 'giao hàng thành công' },
    FAILED: { description: 'giao hàng thất bại' },
    REFUND: { description: 'trả hàng' },
    REFUND_SUCCESSFUL: { description: 'trả hàng thành công' },
  };
  static getDeliveryStatusArray() {
    return Object.entries(this.DELIVERY_STATUS).map(([key, value]) => ({
      name: key,
      ...value,
    }));
  }
  @ManyToOne(() => UserAddress, (userAddress) => userAddress.orderDeliveries, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_address_id' })
  userAddress: UserAddress;

  @Column({ nullable: true })
  full_address: string;

  @ManyToOne(() => Province, (province) => province.orderDeliveries, {
    nullable: true,
  })
  @JoinColumn({ name: 'province_code' })
  province: Province;

  @ManyToOne(() => District, (district) => district.orderDeliveries, {
    nullable: true,
  })
  @JoinColumn({ name: 'district_code' })
  district: District;

  @ManyToOne(() => Ward, (ward) => ward.orderDeliveries, { nullable: true })
  @JoinColumn({ name: 'ward_code' })
  ward: Ward;

  @Column({ nullable: true })
  consignee_s_name: string;

  @Column({ nullable: true })
  consignee_s_telephone: string;

  @Column({
    nullable: true,
    default: Object.keys(OrderDelivery.DELIVERY_STATUS)[0],
  })
  delivery_status: string;
}
