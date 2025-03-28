import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { User } from '../users/entities/user.entity';
import { BaseService } from 'src/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Topic } from './entities';
import { Repository } from 'typeorm';
import { QrTopic } from './dto/query-topic.dto';

@Injectable()
export class TopicsService extends BaseService<Topic> {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
  ) {
    super(topicRepo);
  }
  async create(user: User, body: CreateTopicDto) {
    const userRecipient = await this.onUser(body.recipient_id);
    return this.createData(Topic, {
      group_name: body.group_name,
      users: [user, userRecipient],
    });
  }

  async findAll(user: User, qr: QrTopic) {
    const queryBuilder = this.topicRepo
      .createQueryBuilder('tb_topic')
      .innerJoin('tb_topic.users', 'user', 'user.id = :user_id')
      .leftJoin('tb_topic.users', 'all_user')
      .setParameter('user_id', user.id)
      .addSelect(['all_user.id', 'all_user.email', 'all_user.fullname'])
      .orderBy('tb_topic.updated_at', 'DESC');
    return this.paginateBuilder(qr, queryBuilder);
  }

  findOne(id: number) {
    return this.detail(
      id,
      { throwNotFound: true },
      {
        relations: {
          users: { media: true },
        },
        select: { users: User.select },
      },
    );
  }

  update(id: number, updateTopicDto: UpdateTopicDto) {
    return `This action updates a #${id} topic`;
  }

  remove(id: number) {
    return `This action removes a #${id} topic`;
  }
  async onUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async onTopicUser(user_id: number, topic_id) {
    const topic = await this.topicRepo.findOne({
      where: { id: topic_id, users: { id: user_id } },
    });
    if (!topic) throw new NotFoundException('Topic not found');
    return topic;
  }
}
