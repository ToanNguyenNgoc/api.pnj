import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { CreateUserAddressDto, UpdateUserAddressDto } from './dto';
import { RequestHeaderType } from 'src/types';
import { User } from '../users/entities/user.entity';
import { OAuthGuard } from 'src/middlewares';
import { BaseQuery } from 'src/commons';

@ApiTags(SWAGGER_TAG.UserAddresses)
@ApiBearerAuth(NAME.JWT)
@Controller('user-addresses')
@UseGuards(OAuthGuard)
export class UserAddressesController {
  constructor(private readonly userAddressesService: UserAddressesService) {}

  @Post()
  create(
    @Req() request: RequestHeaderType<User>,
    @Body() createUserAddressDto: CreateUserAddressDto,
  ) {
    return this.userAddressesService.create(request.user, createUserAddressDto);
  }

  @Get()
  findAll(@Req() request: RequestHeaderType<User>, @Param() qr: BaseQuery) {
    return this.userAddressesService.findAll(request.user, qr);
  }

  @Get(':id')
  findOne(@Req() request: RequestHeaderType<User>, @Param('id') id: string) {
    return this.userAddressesService.findOne(request.user, +id);
  }

  @Patch(':id')
  update(
    @Req() request: RequestHeaderType<User>,
    @Param('id') id: string,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ) {
    return this.userAddressesService.update(
      request.user,
      +id,
      updateUserAddressDto,
    );
  }

  @Delete(':id')
  remove(@Req() request: RequestHeaderType<User>, @Param('id') id: string) {
    return this.userAddressesService.remove(request.user, +id);
  }
}
