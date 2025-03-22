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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { BaseQuery } from 'src/commons';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { Roles } from 'src/decorators';

@Controller('brands')
@ApiTags(SWAGGER_TAG.Brand)
@ApiBearerAuth(NAME.JWT)
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.brands.post')
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  findAll(@Query() qr: BaseQuery) {
    return this.brandsService.findAll(qr);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.brands.:id.patch')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.brands.:id.delete')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
