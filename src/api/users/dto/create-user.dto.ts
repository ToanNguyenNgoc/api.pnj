import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  fullname: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  telephone: string;

  @ApiProperty({ default: '2025-02-26' })
  @Matches(/^\d{4}-\d{2}-\d{2}/, {
    message: 'Date is must match YYYY-MM-DD',
  })
  birthday: Date;

  @ApiProperty()
  @IsBoolean()
  gender: boolean;

  @ApiProperty()
  password: string;

  @ApiProperty({ default: [] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  role_ids: number[];

  @ApiProperty()
  @IsOptional()
  media_id: number;
}
