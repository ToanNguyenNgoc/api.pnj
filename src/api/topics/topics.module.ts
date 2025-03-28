import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Topic } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Topic])],
  controllers: [TopicsController],
  providers: [TopicsService],
})
export class TopicsModule {}
