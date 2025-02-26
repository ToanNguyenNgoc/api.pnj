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

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
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
