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
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Media } from 'src/api/media/entities';
import { UserAddress } from 'src/api/user-addresses/entities';
import { Order } from 'src/api/orders/entities';
import { Message } from 'src/api/messages/entities/message.entity';

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  //Relationship

  @OneToMany(() => UserAddress, (address) => address.user)
  addresses: UserAddress[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
