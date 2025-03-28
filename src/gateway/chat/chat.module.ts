import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/api/users/entities/user.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Topic } from 'src/api/topics/entities';
import { Message } from 'src/api/messages/entities/message.entity';
import { Media } from 'src/api/media/entities';
import { CacheService, OAthService } from 'src/services';
import { JwtService } from '@nestjs/jwt';
import { TopicsService } from 'src/api/topics/topics.service';
import { MessagesService } from 'src/api/messages/messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Topic, Message, Media])],
  controllers: [],
  providers: [
    ChatService,
    ChatGateway,
    OAthService,
    JwtService,
    TopicsService,
    CacheService,
    MessagesService,
  ],
})
export class ChatModule {}
