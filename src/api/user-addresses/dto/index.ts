import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateUserAddressDto {
  @ApiProperty({ default: 'Số nhà 117-119' })
  @IsNotEmpty()
  short_address: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  is_default: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  is_bookmark: boolean;

  @ApiProperty()
  @IsOptional()
  consignee_s_name: string;

  @ApiProperty()
  @IsOptional()
  consignee_s_telephone: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  province_code: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  district_code: number;

  @ApiProperty({ default: 4 })
  @IsNumber()
  ward_code: number;
}
export class UpdateUserAddressDto {
  @ApiProperty({ default: 'Số nhà 117-119' })
  @IsOptional()
  short_address: string;

  @ApiProperty({ default: false })
  @IsOptional()
  is_default: boolean;

  @ApiProperty({ default: false })
  @IsOptional()
  is_bookmark: boolean;

  @ApiProperty()
  @IsOptional()
  consignee_s_name: string;

  @ApiProperty()
  @IsOptional()
  consignee_s_telephone: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @IsOptional()
  province_code: number;

  @ApiProperty({ default: 1 })
  @IsOptional()
  @IsNumber()
  district_code: number;

  @ApiProperty({ default: 4 })
  @IsOptional()
  @IsNumber()
  ward_code: number;
}
