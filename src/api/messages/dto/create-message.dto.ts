import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IsNotHtml } from 'src/decorators';

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNotHtml()
  msg: string;

  @ApiProperty()
  @IsNumber()
  topic_id: number;

  @ApiProperty({ default: [] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  media_ids: number[];
}
