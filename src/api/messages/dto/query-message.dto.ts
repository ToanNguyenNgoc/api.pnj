import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/commons';
import { Message } from '../entities/message.entity';

export class QrMessage extends BaseQuery {
  @ApiProperty()
  @IsNotEmpty()
  topic_id: number;

  @ApiProperty({
    required: false,
    description: Message.sortable.join(', '),
  })
  @IsOptional()
  @IsIn(Message.sortable)
  sort?: string;
}
