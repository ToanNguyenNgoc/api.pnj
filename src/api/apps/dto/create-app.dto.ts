import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class CreateAppDto {
  @ApiProperty()
  bundle: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  @IsIn(['ios', 'android'])
  platform: string;

  @ApiProperty()
  url: string;
}
