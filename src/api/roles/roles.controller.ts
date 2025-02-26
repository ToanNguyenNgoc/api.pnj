import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { Roles } from 'src/decorators';
import { OAuthGuard, RoleGuard } from 'src/middlewares';

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
}
