import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
