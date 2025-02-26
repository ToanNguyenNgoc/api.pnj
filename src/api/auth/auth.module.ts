import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Media } from '../media/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Media])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
