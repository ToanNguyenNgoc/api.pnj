import { Process, Processor } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import axios from 'axios';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { District, Province, Ward } from 'src/api/provinces/entities';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
@Processor(QUEUE_NAME.instance_province)
export class ProvinceConsumer {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepo: Repository<Province>,
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(Ward)
    private readonly wardRepo: Repository<Ward>,
  ) {}
  @Process()
  async handleTask(job: Job<any>) {
    await this.onInstance();
    await job.progress(100);
    return;
  }
  async onInstance() {
    if ((await this.provinceRepo.count()) === 0) {
      try {
        const provinceEntities = await axios
          .get('https://provinces.open-api.vn/api/?depth=1')
          .then((res) => res.data);
        await this.provinceRepo.save(provinceEntities);
      } catch (error) {}
    }
    if ((await this.districtRepo.count()) === 0) {
      try {
        const provincesApi = await axios.get(
          'https://provinces.open-api.vn/api/?depth=2',
        );
        const districtEntities = provincesApi.data
          .map((item: any) => item.districts)
          .flat();
        await this.districtRepo.save(districtEntities);
      } catch (error) {}
    }
    if ((await this.wardRepo.count()) == 0) {
      try {
        const wardsEntities = (
          await axios.get('https://provinces.open-api.vn/api/w/')
        ).data;
        await this.wardRepo.save(wardsEntities);
      } catch (error) {}
    }
    return;
  }
}
