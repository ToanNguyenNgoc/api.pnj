import { Controller, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { Roles } from 'src/decorators';
import { jsonResponse } from 'src/commons';

@ApiTags(SWAGGER_TAG.Admin)
@Controller('admin')
@UseGuards(OAuthGuard)
@ApiBearerAuth(NAME.JWT)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Post()
  // create(@Body() createAdminDto: CreateAdminDto) {
  //   return this.adminService.create(createAdminDto);
  // }

  @Post('instance')
  instance() {
    return this.adminService.instance();
  }

  @Post('clear-topic')
  @UseGuards(RoleGuard)
  @Roles('.topics.:id.delete')
  clearMessage() {
    this.adminService.clearMessage();
    return jsonResponse([]);
  }

  // @Get()
  // findAll() {
  //   return this.adminService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminService.remove(+id);
  // }
}
