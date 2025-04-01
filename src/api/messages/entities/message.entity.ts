import { Media } from 'src/api/media/entities';
import { Topic } from 'src/api/topics/entities';
import { User } from 'src/api/users/entities/user.entity';
import { BaseEntity } from 'src/commons';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity('tb_message')
export class Message extends BaseEntity {
  static sortable = ['createdAt', '-createdAt', 'id', '-id'];

  @Column({ length: 1000, nullable: true })
  msg: string;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Topic, (topic) => topic.messages)
  @JoinColumn({ name: 'topic_id' })
  topic: Topic;

  @ManyToMany(() => Media)
  @JoinTable()
  medias: Media[];
}
