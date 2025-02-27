import { Injectable } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class BannersService {
  @InjectRepository(Banner)
  private readonly bannerRepo: Repository<Banner>;
  create(createBannerDto: CreateBannerDto) {
    return 'This action adds a new banner';
  }

  findAll() {
    return `This action returns all banners`;
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  update(id: number, updateBannerDto: UpdateBannerDto) {
    return `This action updates a #${id} banner`;
  }

  remove(id: number) {
    return `This action removes a #${id} banner`;
  }
}
