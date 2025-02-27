import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { Roles } from 'src/decorators';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { CreateRoleDto } from './dto';

@ApiTags(SWAGGER_TAG.RolePermission)
@Controller('roles')
@ApiBearerAuth(NAME.JWT)
@UseGuards(OAuthGuard, RoleGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles('.roles.get')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles('.roles.:id.get')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Post()
  @Roles('.roles.post')
  create(@Body() body: CreateRoleDto) {
    return this.rolesService.create(body);
  }

  @Patch(':id')
  @Roles('.roles.:id.patch')
  update(@Param('id') id: string, @Body() body: CreateRoleDto) {
    return this.rolesService.update(Number(id), body);
  }

  @Delete(':id')
  @Roles('.roles.:id.delete')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
