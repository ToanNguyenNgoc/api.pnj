import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Organization } from './organization.entity';

@Entity({ name: 'tb_organization_contact' })
export class OrganizationContact extends BaseEntity {
  static CONTACT_TYPE = {
    PHONE: { desc: 'số điện thoại' },
    EMAIL: { desc: 'email' },
    SOCIAL: { desc: 'mạng xã hội' },
  };
  static getContactTypeArray() {
    return Object.entries(this.CONTACT_TYPE).map(([key, value]) => ({
      name: key,
      ...value,
    }));
  }

  @ManyToOne(() => Organization, (organization) => organization.contacts)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({
    nullable: true,
    default: Object.keys(OrganizationContact.CONTACT_TYPE)[0],
  })
  contact_type: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  icon: string;
}
