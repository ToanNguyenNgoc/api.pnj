import { Injectable } from '@nestjs/common';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCategory } from './entities';
import { Repository } from 'typeorm';
import { BaseService } from 'src/services';
import { slugify } from 'src/utils';
import { QrBlogCategory } from './dto';

@Injectable()
export class BlogCategoriesService extends BaseService<BlogCategory> {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly blogCategoryRepo: Repository<BlogCategory>,
  ) {
    super(blogCategoryRepo);
  }
  create(body: CreateBlogCategoryDto) {
    return this.createData(BlogCategory, {
      name: body.name,
      name_slugify: slugify(body.name),
    });
  }

  findAll(qr: QrBlogCategory) {
    return this.paginate(qr);
  }

  findOne(id: number) {
    return this.detail(id, { throwNotFound: true });
  }

  update(id: number, body: UpdateBlogCategoryDto) {
    return this.findAndUpdate(id, body);
  }

  remove(id: number) {
    this.softDelete(id);
  }
}
