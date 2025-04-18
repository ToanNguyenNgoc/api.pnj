import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { BaseService, CacheService, GetMediaService } from 'src/services';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicsService } from '../topics/topics.service';
import { User } from '../users/entities/user.entity';
import { Topic } from '../topics/entities';
import { QrMessage } from './dto/query-message.dto';
import { Media } from '../media/entities';
import { base64encode } from 'src/utils';
import { jsonResponse } from 'src/commons';

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
    await this.topicRepo.save({ ...topic, msg: body.msg || Media.TYPE.MEDIA });
    return this.createData(Message, {
      msg: body.msg,
      topic,
      user: userAuth,
      medias: await this.mediaService.getMultiple(body.media_ids),
    });
  }

  async findAll(user: User, qr: QrMessage) {
    return this.paginate(qr, {
      where: {
        topic: { id: qr.topic_id, users: { id: user.id } },
      },
      relations: { user: { media: true }, medias: true },
      select: { user: User.select },
      order: this.getSort(qr.sort),
    });
  }
  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  async remove(user: User, id: number) {
    const message = await this.msgRepo.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!message) throw new NotFoundException();
    message.active = false;
    message.msg = base64encode(message.msg || '');
    message.medias = [];
    await this.msgRepo.save(message);
    return jsonResponse({}, 'Remove success');
  }
}
