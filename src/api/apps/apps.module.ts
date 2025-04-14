import { Module } from '@nestjs/common';
import { AppsService } from './apps.service';
import { AppsController } from './apps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([AppEntity])],
  controllers: [AppsController],
  providers: [AppsService],
})
export class AppsModule {}
