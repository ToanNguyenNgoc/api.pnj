import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class QrApp {
  @ApiProperty()
  @IsNotEmpty()
  platform: string;
}
