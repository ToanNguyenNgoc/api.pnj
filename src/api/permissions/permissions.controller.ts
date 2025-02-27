import { Controller, Get, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { Roles } from 'src/decorators';

@ApiTags(SWAGGER_TAG.RolePermission)
@ApiBearerAuth(NAME.JWT)
@UseGuards(OAuthGuard, RoleGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @Roles('.permissions.get')
  async findAll() {
    return await this.permissionsService.findAll();
  }
}
