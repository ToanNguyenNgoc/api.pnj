import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'database/data-source';
import { ApiModule } from './api/api.module';
import { JwtConfigModule } from './commons';
import { BullModule } from '@nestjs/bull';
import { ChatModule } from './gateway';
import { CacheModule } from '@nestjs/cache-manager';
import { bullConfig, cacheConfig } from './configs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    BullModule.forRoot(bullConfig),
    CacheModule.registerAsync(cacheConfig),
    ApiModule,
    JwtConfigModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
