import { Module } from '@nestjs/common';
import {
  DistrictService,
  ProvincesService,
  WardService,
} from './provinces.service';
import { ProvincesController, WardController } from './provinces.controller';
import { ProvinceConsumer } from 'src/jobs';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District, Province, Ward } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Province, District, Ward]),
    BullModule.registerQueue({ name: QUEUE_NAME.instance_province }),
  ],
  controllers: [ProvincesController, WardController],
  providers: [ProvincesService, ProvinceConsumer, DistrictService, WardService],
})
export class ProvincesModule {}
