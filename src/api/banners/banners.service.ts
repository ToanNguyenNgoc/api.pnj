import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities';
import { MoreThan, Repository } from 'typeorm';
import { BaseService, GetMediaService } from 'src/services';
import { Product } from '../product/entities';
import { QrBanner } from './dto';
import { BaseGateway } from 'src/gateway/base/base.gateway';

@Injectable()
export class BannersService extends BaseService<Banner> {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly mediaService: GetMediaService,
    private readonly baseGateway: BaseGateway,
  ) {
    super(bannerRepo);
  }

  async create(body: CreateBannerDto) {
    const media = await this.mediaService.getOne(body.media_id);
    const thumbnailMedia = await this.mediaService.getOne(
      body.thumbnail_media_id,
    );
    const product = await this.onProduct(body.product_id);
    return this.createData(Banner, {
      ...body,
      media,
      thumbnailMedia,
      product,
    });
  }

  findAll(qr: QrBanner) {
    return this.paginate(qr, {
      where: {
        active: this.getBoolean(qr.active),
        name: this.getLike(qr.search),
        expires_at: !qr.all ? MoreThan(new Date()) : undefined,
      },
      relations: {
        media: this.getIncludes('media', qr.includes),
        thumbnailMedia: this.getIncludes('thumbnailMedia', qr.includes),
        product: this.getIncludes('product', qr.includes),
      },
      order: this.getSort(qr.sort),
    });
  }

  findOne(id: number) {
    return this.detail(
      id,
      { throwNotFound: true },
      {
        relations: {
          media: true,
          thumbnailMedia: true,
          product: true,
        },
      },
    );
  }

  async update(id: number, body: UpdateBannerDto) {
    return this.findAndUpdate(id, {
      ...body,
      media_id: await this.mediaService.getOne(body.media_id),
      thumbnail_media_id: await this.mediaService.getOne(
        body.thumbnail_media_id,
      ),
      product_id: await this.onProduct(body.product_id),
    });
  }

  remove(id: number) {
    return this.softDelete(id);
  }
  async onProduct(id?: number) {
    if (!id) return undefined;
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
