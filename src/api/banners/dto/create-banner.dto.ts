import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
} from 'class-validator';
import { Banner } from '../entities';
import moment from 'moment';

export class CreateBannerDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  media_id: number;

  @ApiProperty({ default: Banner.TYPE.HTML.value })
  @IsIn(Object.keys(Banner.TYPE))
  type: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  product_id: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  thumbnail_media_id: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  priority: number;

  @ApiProperty({
    default: moment().add('month', 1).format('YYYY-MM-DD'),
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}/, {
    message: 'Date is must match YYYY-MM-DD',
  })
  expires_at: Date;
}
