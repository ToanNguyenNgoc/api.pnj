import { Module } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { ProvincesController } from './provinces.controller';
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
  controllers: [ProvincesController],
  providers: [ProvincesService, ProvinceConsumer],
})
export class ProvincesModule {}
