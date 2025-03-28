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

@Injectable()
export class MessagesService extends BaseService<Message> {
  constructor(
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
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
