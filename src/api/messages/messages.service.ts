import { Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { BaseService, GetMediaService } from 'src/services';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicsService } from '../topics/topics.service';
import { User } from '../users/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { jsonResponse } from 'src/commons';

@Injectable()
export class MessagesService extends BaseService<Message> {
  constructor(
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
    private readonly topicService: TopicsService,
    private readonly mediaService: GetMediaService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super(msgRepo);
  }
  async create(userAuth: User, body: CreateMessageDto) {
    const topic = await this.topicService.onTopicUser(
      userAuth.id,
      body.topic_id,
    );
    const media = await this.mediaService.getOne(body.media_id);
    return 'This action adds a new message';
  }

  async findAll() {
    const data = await this.cacheManager.get('TEST');
    return jsonResponse(data);
  }
  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    await this.cacheManager.set('TEST', { id: 1, name: 'bear' });
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
