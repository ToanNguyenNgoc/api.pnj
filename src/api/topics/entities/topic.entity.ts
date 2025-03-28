import { Message } from 'src/api/messages/entities/message.entity';
import { User } from 'src/api/users/entities/user.entity';
import { BaseEntity } from 'src/commons';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity('tb_topic')
export class Topic extends BaseEntity {
  static relations = ['users'];
  static sortable = ['createdAt', '-createdAt', 'id', '-id'];

  @Column({ nullable: true })
  group_name: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}
