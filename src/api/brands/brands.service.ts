import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities';
import { Repository } from 'typeorm';
import { BaseService, GetMediaService } from 'src/services';
import { BaseQuery } from 'src/commons';
import { slugify } from 'src/utils';

@Injectable()
export class BrandsService extends BaseService<Brand> {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,
    private readonly getMediaService: GetMediaService,
  ) {
    super(brandRepo);
  }
  async create(body: CreateBrandDto) {
    const media = await this.getMediaService.getOne(body.media_id);
    return this.createData(Brand, {
      name: body.name,
      name_slugify: slugify(body.name),
      media,
    });
  }

  findAll(qr: BaseQuery) {
    return this.paginate(qr, {
      where: {
        name: this.getLike(qr.search),
        active: this.getBoolean(qr.active),
      },
      relations: { media: true },
    });
  }

  findOne(id: number | string) {
    return this.detail(
      id,
      { allowSlugify: true, throwNotFound: true },
      { relations: { media: true } },
    );
  }

  async update(id: number, { name, media_id }: UpdateBrandDto) {
    return this.findAndUpdate(id, {
      name,
      media: await this.getMediaService.getOne(media_id),
    });
  }

  remove(id: number) {
    return this.softDelete(id);
  }
  async onBrand(id?: number) {
    if (!id) return undefined;
    const brand = await this.brandRepo.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }
}
