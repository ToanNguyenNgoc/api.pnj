import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import {
  BannersController,
  BannersTypesController,
} from './banners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities';
import { Media } from '../media/entities';
import { Product } from '../product/entities';
import { GetMediaService } from 'src/services';

@Module({
  imports: [TypeOrmModule.forFeature([Banner, Media, Product])],
  controllers: [BannersTypesController, BannersController],
  providers: [BannersService, GetMediaService],
})
export class BannersModule {}
