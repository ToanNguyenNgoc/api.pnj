import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty()
  @IsNumber()
  recipient_id: number;

  @ApiProperty()
  @IsOptional()
  group_name: string;
}
