import { Permission } from 'src/api/permissions/entities/permission.entity';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

@Entity('tb_role')
export class Role extends BaseEntity {
  @Column()
  name: string;

  @Column()
  guard_name: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
