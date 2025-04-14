import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AppEntity } from './entities';
import { Repository } from 'typeorm';
import { BaseService } from 'src/services';
import { QrApp } from './dto/qr-app.dto';
import { jsonResponse } from 'src/commons';

@Injectable()
export class AppsService extends BaseService<AppEntity> {
  constructor(
    @InjectRepository(AppEntity)
    private readonly appEntityRepo: Repository<AppEntity>,
  ) {
    super(appEntityRepo);
  }
  create(body: CreateAppDto) {
    return this.createData(AppEntity, body);
  }

  findAll() {
    return `This action returns all apps`;
  }

  async findOne(id: string, qr: QrApp) {
    const app = await this.appEntityRepo.findOne({
      where: { bundle: id, platform: qr.platform },
      order: { createdAt: 'desc' },
    });
    if (!app) throw new NotFoundException('Bundle not found');
    return jsonResponse(app);
  }

  update(id: number, updateAppDto: UpdateAppDto) {
    return `This action updates a #${id} app`;
  }

  remove(id: number) {
    return `This action removes a #${id} app`;
  }
}
