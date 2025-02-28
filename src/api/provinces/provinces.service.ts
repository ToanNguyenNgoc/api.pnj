import { Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { Queue } from 'bull';
import { BaseService } from 'src/services';
import { Province } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProvincesService extends BaseService<Province> {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepo: Repository<Province>,
    @InjectQueue(QUEUE_NAME.instance_province)
    private readonly createProvinceQueue: Queue,
  ) {
    super(provinceRepo);
  }
  create(createProvinceDto: CreateProvinceDto) {
    return 'This action adds a new province';
  }

  async findAll() {
    await this.createProvinceQueue.add({}, { delay: 1000 });
    return this.paginate({ limit: 100 });
  }

  findOne(id: number) {
    return `This action returns a #${id} province`;
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
