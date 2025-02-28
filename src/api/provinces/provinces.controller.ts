import { Controller, Get } from '@nestjs/common';
import { ProvincesService } from './provinces.service';
import { ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from 'src/constants';

@Controller('provinces')
@ApiTags(SWAGGER_TAG.Province)
export class ProvincesController {
  constructor(private readonly provincesService: ProvincesService) {}

  // @Post()
  // create(@Body() createProvinceDto: CreateProvinceDto) {
  //   return this.provincesService.create(createProvinceDto);
  // }

  @Get()
  findAll() {
    return this.provincesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.provincesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProvinceDto: UpdateProvinceDto) {
  //   return this.provincesService.update(+id, updateProvinceDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.provincesService.remove(+id);
  // }
}
