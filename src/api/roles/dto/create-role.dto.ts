import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty({ default: [] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  permission_ids: number[];
}
