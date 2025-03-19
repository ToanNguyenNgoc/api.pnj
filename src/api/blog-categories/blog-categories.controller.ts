import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogCategoriesService } from './blog-categories.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { QrBlogCategory } from './dto';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { Roles } from 'src/decorators';

@Controller('blog-categories')
@ApiTags(SWAGGER_TAG.BlogCategory)
@ApiBearerAuth(NAME.JWT)
export class BlogCategoriesController {
  constructor(private readonly blogCategoriesService: BlogCategoriesService) {}

  @Post()
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.blog-categories.post')
  create(@Body() createBlogCategoryDto: CreateBlogCategoryDto) {
    return this.blogCategoriesService.create(createBlogCategoryDto);
  }

  @Get()
  findAll(@Query() qr: QrBlogCategory) {
    return this.blogCategoriesService.findAll(qr);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogCategoriesService.findOne(+id);
  }

  @Patch(':id')
  @Post()
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.blog-categories.:id.patch')
  update(
    @Param('id') id: string,
    @Body() updateBlogCategoryDto: UpdateBlogCategoryDto,
  ) {
    return this.blogCategoriesService.update(+id, updateBlogCategoryDto);
  }

  @Delete(':id')
  @Post()
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.blog-categories.:id.delete')
  remove(@Param('id') id: string) {
    return this.blogCategoriesService.remove(+id);
  }
}
