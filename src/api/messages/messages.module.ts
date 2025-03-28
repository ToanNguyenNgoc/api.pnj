import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Topic } from '../topics/entities';
import { Message } from './entities/message.entity';
import { Media } from '../media/entities';
import { CacheService, GetMediaService } from 'src/services';
import { TopicsService } from '../topics/topics.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Topic, Message, Media])],
  controllers: [MessagesController],
  providers: [MessagesService, GetMediaService, TopicsService, CacheService],
})
export class MessagesModule {}
