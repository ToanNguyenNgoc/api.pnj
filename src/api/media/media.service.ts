import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) {}
  async update(file: Express.Multer.File) {
    try {
      const media = new Media();
      media.file_name = file.filename;
      media.mime_type = file.mimetype;
      media.name = file.filename;
      media.original_url = `${process.env.APP_URL}/${file.path}`;
      return await this.mediaRepo.save(media);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
