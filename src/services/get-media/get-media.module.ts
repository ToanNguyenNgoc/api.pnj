import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/api/media/entities';
import { GetMediaService } from './get-media.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  providers: [GetMediaService],
  exports: [GetMediaService],
})
export class GetMediaModule {}
