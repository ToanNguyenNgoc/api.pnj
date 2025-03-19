import { Media } from 'src/api/media/entities';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrganizationContact } from './organization-contact.entity';
import { District, Province, Ward } from 'src/api/provinces/entities';

@Entity({ name: 'tb_organization' })
export class Organization extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @ManyToOne(() => Media, (media) => media.organizations)
  @JoinColumn({ name: 'media_id' })
  media: Media;

  @OneToMany(
    () => OrganizationContact,
    (organizationContact) => organizationContact.organization,
  )
  contacts: OrganizationContact[];

  @Column({ nullable: true })
  short_address: string;

  @ManyToOne(() => Province, (province) => province.organizations)
  @JoinColumn({ name: 'province_code' })
  province: Province;

  @ManyToOne(() => District, (district) => district.organizations)
  @JoinColumn({ name: 'district_code' })
  district: District;

  @ManyToOne(() => Ward, (ward) => ward.organizations)
  @JoinColumn({ name: 'ward_code' })
  ward: Ward;
}
