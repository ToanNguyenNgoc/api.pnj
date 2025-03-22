import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities';
import { Media } from '../media/entities';
import { GetMediaService } from 'src/services';

@Module({
  imports: [TypeOrmModule.forFeature([Brand, Media])],
  controllers: [BrandsController],
  providers: [BrandsService, GetMediaService],
})
export class BrandsModule {}
