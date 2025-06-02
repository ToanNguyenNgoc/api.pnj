import { User } from 'src/api/users/entities/user.entity';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'tb_notification' })
export class Notification extends BaseEntity {
  static TYPE_ORDER = 'ORDER';
  static TYPE_MESSAGE = 'MESSAGE';

  @ManyToOne(() => User, (user) => user.send_notifications)
  @JoinColumn({ name: 'sender_id' })
  user: User;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  payload_id: number;

  @Column({ nullable: true, default: false })
  is_read: boolean;

  @ManyToOne(() => User, (user) => user.recipient_notifications, {
    nullable: true,
  })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;
}
