import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { BaseService, OAthService } from 'src/services';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { jsonResponse } from 'src/commons';
import { BaseGateway } from 'src/gateway/base/base.gateway';

@Injectable()
export class NotificationsService extends BaseService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private readonly notiRepo: Repository<Notification>,
    private readonly oauthService: OAthService,
    private readonly baseGateway: BaseGateway,
  ) {
    super(notiRepo);
  }
  async create(body: CreateNotificationDto) {
    const sender = await this.oauthService.onUser(body.sender_id, false);
    const notiEntities = new Notification();
    notiEntities.user = sender;
    notiEntities.content = body.content;
    notiEntities.type = body.type;
    notiEntities.payload_id = body.payload_id;
    notiEntities.recipient = body.recipient_id
      ? await this.oauthService.onUser(body.recipient_id, false)
      : null;
    const noti = await this.notiRepo.save(notiEntities, { reload: true });
    body.recipient_id
      ? this.baseGateway.sendNotificationUser(noti)
      : this.baseGateway.sendNotificationOrg(noti);
    return jsonResponse(noti);
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
