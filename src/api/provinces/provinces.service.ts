import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { Queue } from 'bull';
import { BaseService } from 'src/services';
import { District, Province, Ward } from './entities';
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

  async findAll() {
    await this.createProvinceQueue.add({}, { delay: 1000 });
    return this.paginate({ limit: 100 }, { order: { code: 'ASC' } });
  }
}

@Injectable()
export class DistrictService extends BaseService<District> {
  constructor(
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
  ) {
    super(districtRepo);
  }
  async findAll(id) {
    return this.paginate(
      { limit: 100 },
      { where: { province_code: id }, order: { code: 'ASC' } },
    );
  }
}

@Injectable()
export class WardService extends BaseService<Ward> {
  constructor(
    @InjectRepository(Ward)
    private readonly wardRepo: Repository<Ward>,
  ) {
    super(wardRepo);
  }
  async findAll(id: number) {
    return this.paginate(
      { limit: 100 },
      { where: { district_code: id }, order: { code: 'ASC' } },
    );
  }
}
