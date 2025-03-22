import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductItem, ProductMedia } from './entities';
import { Media } from '../media/entities';
import { Category } from '../categories/entities';
import { BrandsService } from '../brands/brands.service';
import { Brand } from '../brands/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      ProductMedia,
      ProductItem,
      Media,
      Brand,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, BrandsService],
})
export class ProductModule {}
