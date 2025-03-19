import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OrganizationContact } from '../entities';

export class CreateOrgContactItemDto {
  @ApiProperty({ example: Object.keys(OrganizationContact.CONTACT_TYPE)[0] })
  @IsIn(Object.keys(OrganizationContact.CONTACT_TYPE))
  contact_type: string;

  @ApiProperty()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsOptional()
  icon: string;
}

export class UpdateOrgContactItemDto extends CreateOrgContactItemDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number;
}

export class CreateOrganizationDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  media_id: number;

  @ApiProperty({ default: 'số xx, đường xxx' })
  @IsNotEmpty()
  short_address: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  province_code: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  district_code: number;

  @ApiProperty({ default: 4 })
  @IsNumber()
  ward_code: number;

  @ApiProperty({
    type: [CreateOrgContactItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrgContactItemDto)
  contacts: CreateOrgContactItemDto[];
}
