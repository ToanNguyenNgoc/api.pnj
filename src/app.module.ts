import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'database/data-source';
import { ApiModule } from './api/api.module';
import { JwtConfigModule } from './commons';
import { BullModule } from '@nestjs/bull';
// import { SchedulesModules } from './schedules/schedules.module';
import { ChatGateway } from './gateway/chat/chat.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT || 6379),
      },
    }),
    ApiModule,
    JwtConfigModule,
    // SchedulesModules,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
