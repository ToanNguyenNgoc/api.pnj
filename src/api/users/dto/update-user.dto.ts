import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  fullname: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  telephone: string;

  @ApiProperty({ default: '2025-02-26' })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}/, {
    message: 'Date is must match YYYY-MM-DD',
  })
  birthday: Date;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  gender: boolean;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsOptional()
  active: boolean;

  @ApiProperty({ default: [] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  role_ids: number[];

  @ApiProperty()
  @IsOptional()
  media_id: number;
}
