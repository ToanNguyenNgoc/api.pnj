import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAG } from 'src/constants';
import { Roles } from 'src/decorators';
import { RoleGuard } from 'src/middlewares';

@ApiTags(SWAGGER_TAG.RolePermission)
@Controller('roles')
@UseGuards(RoleGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.create(createRoleDto);
  // }

  @Get()
  @Roles('roles.get')
  findAll() {
    return this.rolesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rolesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }
}
