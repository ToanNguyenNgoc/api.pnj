import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBlogCategoryDto } from './create-blog-category.dto';
import { IsOptional } from 'class-validator';

export class UpdateBlogCategoryDto extends PartialType(CreateBlogCategoryDto) {
  @ApiProperty()
  @IsOptional()
  active?: boolean;
}
