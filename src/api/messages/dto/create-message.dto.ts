import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IsNotHtml } from 'src/decorators';

export class CreateMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNotHtml()
  msg: string;

  @ApiProperty()
  @IsNumber()
  topic_id: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  media_id: number;
}
