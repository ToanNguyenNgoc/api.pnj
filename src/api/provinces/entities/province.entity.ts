import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

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

  @CreateDateColumn()
  createdAt?: Date;
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

  @CreateDateColumn()
  createdAt?: Date;
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

  @CreateDateColumn()
  createdAt?: Date;
}
