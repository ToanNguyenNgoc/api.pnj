import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AppsService } from './apps.service';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { QrApp } from './dto/qr-app.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  create(@Body() createAppDto: CreateAppDto) {
    return this.appsService.create(createAppDto);
  }

  @Get()
  findAll() {
    return this.appsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query() qr: QrApp) {
    return this.appsService.findOne(id, qr);
  }

  @Patch(':id')
  @ApiExcludeEndpoint()
  update(@Param('id') id: string, @Body() updateAppDto: UpdateAppDto) {
    return this.appsService.update(+id, updateAppDto);
  }

  @Delete(':id')
  @ApiExcludeEndpoint()
  remove(@Param('id') id: string) {
    return this.appsService.remove(+id);
  }
}
