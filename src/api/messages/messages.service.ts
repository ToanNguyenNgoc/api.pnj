import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { BaseService, CacheService, GetMediaService } from 'src/services';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicsService } from '../topics/topics.service';
import { User } from '../users/entities/user.entity';
import { jsonResponse } from 'src/commons';
import { Topic } from '../topics/entities';

@Injectable()
export class MessagesService extends BaseService<Message> {
  constructor(
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
    private readonly topicService: TopicsService,
    private readonly mediaService: GetMediaService,
    private readonly cacheService: CacheService,
  ) {
    super(msgRepo);
  }
  async create(userAuth: User, body: CreateMessageDto) {
    const topic = await this.topicService.onTopicUser(
      userAuth.id,
      body.topic_id,
    );
    const media = await this.mediaService.getOne(body.media_id);
    return this.createData(Message, {
      msg: body.msg,
      media,
      topic,
      user: userAuth,
    });
  }
  async createMessageWithoutTopic(
    userAuth: User,
    userRecipient: User,
    body: {
      recipient_id: number;
      group_name: string;
      msg: string;
      media_id: number;
    },
  ) {
    const topic = new Topic();
    topic.group_name = body.group_name;
    topic.users = [userAuth, userRecipient];
    const topicResponse = await this.topicRepo.save(topic);

    const message = new Message();
    message.msg = body.msg;
    message.topic = topicResponse;
    message.user = userAuth;
    message.media = await this.mediaService.getOne(body.media_id);
    const messageResponse = await this.msgRepo.save(message);

    return {
      topicResponse,
      messageResponse,
    };
  }

  async findAll() {
    return jsonResponse([]);
  }
  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
