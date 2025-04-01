import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/api/media/entities';
import { In, Repository } from 'typeorm';

@Injectable()
export class GetMediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) {}
  async getOne(media_id: number) {
    if (!media_id) return undefined;
    const media = await this.mediaRepo.findOne({ where: { id: media_id } });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }
  async getMultiple(media_ids?: number[]) {
    if (!media_ids) return;
    const medias = this.mediaRepo.find({ where: { id: In(media_ids) } });
    return medias;
  }
}
