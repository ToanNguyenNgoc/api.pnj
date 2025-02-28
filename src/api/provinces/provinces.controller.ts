import { Controller, Get, Param } from '@nestjs/common';
import {
  DistrictService,
  ProvincesService,
  WardService,
} from './provinces.service';
import { ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from 'src/constants';

@Controller('provinces')
@ApiTags(SWAGGER_TAG.Province)
export class ProvincesController {
  constructor(
    private readonly provincesService: ProvincesService,
    private readonly districtService: DistrictService,
  ) {}

  @Get()
  findAll() {
    return this.provincesService.findAll();
  }
  @Get(':id/districts')
  findAllDistrict(@Param('id') id: string) {
    return this.districtService.findAll(+id);
  }
}

@Controller('districts')
@ApiTags(SWAGGER_TAG.Province)
export class WardController {
  constructor(private readonly wardService: WardService) {}
  @Get(':id/wards')
  findAll(@Param('id') id: string) {
    return this.wardService.findAll(+id);
  }
}
