import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Media } from '../media/entities';
import { SendMailConsumer } from 'src/jobs';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Media]),
    BullModule.registerQueue({ name: QUEUE_NAME.send_mail }),
  ],
  controllers: [AuthController],
  providers: [AuthService, SendMailConsumer],
})
export class AuthModule {}
