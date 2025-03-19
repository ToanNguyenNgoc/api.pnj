import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  CreateOrganizationDto,
  UpdateOrgContactItemDto,
} from './create-organization.dto';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {
  @ApiProperty({ default: true })
  @IsBoolean()
  @IsOptional()
  active: boolean;

  @ApiProperty({
    type: [UpdateOrgContactItemDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrgContactItemDto)
  contacts: UpdateOrgContactItemDto[];
}
