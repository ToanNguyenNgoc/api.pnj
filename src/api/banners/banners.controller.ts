import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { Roles } from 'src/decorators';
import { jsonResponse } from 'src/commons';
import { Banner } from './entities';
import { QrBanner } from './dto';

@Controller('banners-types')
@ApiTags(SWAGGER_TAG.Banner)
export class BannersTypesController {
  @Get()
  findAll() {
    return jsonResponse(Object.values(Banner.TYPE));
  }
}
@Controller('banners')
@ApiTags(SWAGGER_TAG.Banner)
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Post()
  @ApiBearerAuth(NAME.JWT)
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.banners.post')
  create(@Body() createBannerDto: CreateBannerDto) {
    return this.bannersService.create(createBannerDto);
  }

  @Get()
  findAll(@Query() qr: QrBanner) {
    return this.bannersService.findAll(qr);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannersService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth(NAME.JWT)
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.banners.:id.patch')
  update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    return this.bannersService.update(+id, updateBannerDto);
  }

  @Delete(':id')
  @ApiBearerAuth(NAME.JWT)
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.banners.:id.delete')
  remove(@Param('id') id: string) {
    return this.bannersService.remove(+id);
  }
}
