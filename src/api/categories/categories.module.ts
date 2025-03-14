import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities';
import { Media } from '../media/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Media])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
