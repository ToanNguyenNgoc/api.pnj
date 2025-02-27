import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities';
import { Repository } from 'typeorm';
import { BaseService, GetMediaService } from 'src/services';
import { CreateCategoryDto, QrCategory, UpdateCategoryDto } from './dto';
import { slugify } from 'src/utils';

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly mediaService: GetMediaService,
  ) {
    super(categoryRepo);
  }
  async create(createCategoryDto: CreateCategoryDto) {
    return this.createData(Category, {
      media: createCategoryDto.media_id
        ? await this.mediaService.getOne(createCategoryDto.media_id)
        : undefined,
      name: createCategoryDto.name,
      name_slugify: slugify(createCategoryDto.name),
    });
  }

  findAll(query: QrCategory) {
    return this.paginate(query, {
      where: { name: this.getLike(query.search) },
      relations: { media: true },
    });
  }

  findOne(id: string) {
    return this.detail(
      id,
      { throwNotFound: true, allowSlugify: true },
      { relations: { media: true } },
    );
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.findAndUpdate(id, {
      name: updateCategoryDto.name,
      active: updateCategoryDto.active,
      media: updateCategoryDto.media_id
        ? await this.mediaService.getOne(updateCategoryDto.media_id)
        : undefined,
    });
  }

  remove(id: number) {
    this.softDelete(id);
  }
}
