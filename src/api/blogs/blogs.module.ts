import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities';
import { Media } from '../media/entities';
import { GetMediaService } from 'src/services';
import { BlogCategory } from '../blog-categories/entities';

@Module({
  imports: [TypeOrmModule.forFeature([BlogCategory, Blog, Media])],
  controllers: [BlogsController],
  providers: [BlogsService, GetMediaService],
})
export class BlogsModule {}
