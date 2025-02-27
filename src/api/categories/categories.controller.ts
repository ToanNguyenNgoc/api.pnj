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
import { CategoriesService } from './categories.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { CreateCategoryDto, QrCategory, UpdateCategoryDto } from './dto';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { Roles } from 'src/decorators';

@Controller('categories')
@ApiTags(SWAGGER_TAG.Category)
@ApiBearerAuth(NAME.JWT)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.categories.post')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() query: QrCategory) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.categories.:id.patch')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.categories.:id.delete')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
