import { Role } from 'src/api/roles/entities/role.entity';
import {
  Column,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Media } from 'src/api/media/entities';

@Entity({ name: 'tb_user' })
export class User {
  static SUPER_ADMIN = 'SUPER_ADMIN';
  static columns = [
    'active',
    'birthday',
    'createdAt',
    'deletedAt',
    'email',
    'fullname',
    'gender',
    'id',
    'media',
    'roles',
    'telephone',
    'updatedAt',
  ];
  static select = Object.fromEntries(User.columns.map((col) => [col, true]));
  static sortable = [
    'createdAt',
    '-createdAt',
    'id',
    '-id',
    'fullname',
    '-fullname',
  ];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fullname: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true, default: true })
  gender: boolean;

  @Column({ nullable: true })
  active: boolean;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];

  @Column()
  @Exclude()
  password: string;

  @OneToOne(() => Media)
  @JoinColumn()
  media: Media;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
