import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { Roles } from 'src/decorators';

@ApiTags(SWAGGER_TAG.User)
@Controller('users')
@ApiBearerAuth(NAME.JWT)
@UseGuards(OAuthGuard, RoleGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('.users.post')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('.users.get')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('.users.:id.get')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('.users.:id.patch')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles('.users.:id.delete')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
