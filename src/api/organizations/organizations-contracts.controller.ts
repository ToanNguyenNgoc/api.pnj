import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { jsonResponse } from 'src/commons';
import { SWAGGER_TAG } from 'src/constants';
import { OrganizationContact } from './entities';

@Controller('organizations-contacts')
@ApiTags(SWAGGER_TAG.Organizations)
export class OrganizationContactController {
  @Get('contact-types')
  async findAllContactType() {
    return jsonResponse(OrganizationContact.getContactTypeArray());
  }
}
