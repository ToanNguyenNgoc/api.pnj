import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { OAthService } from 'src/services';
import { ChangePasswordDTO, LoginDTO, UpdateProfileDTO } from './dto';
import { jsonResponse } from 'src/commons';
import { OAuthGuard } from 'src/middlewares';
import { RequestHeaderType } from 'src/types';
import { User } from '../users/entities/user.entity';

@ApiTags(SWAGGER_TAG.Auth)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OAthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return jsonResponse(await this.oauthService.login(body));
  }
  @Get('profile')
  @ApiBearerAuth(NAME.JWT)
  @UseGuards(OAuthGuard)
  async profile(@Req() req: RequestHeaderType<User>) {
    return jsonResponse(await this.oauthService.onUser(req.user.id));
  }

  @Post('profile')
  @ApiBearerAuth(NAME.JWT)
  @UseGuards(OAuthGuard)
  async updateProfile(
    @Req() req: RequestHeaderType<User>,
    @Body() body: UpdateProfileDTO,
  ) {
    return jsonResponse(
      await this.authService.updateProfile(req.user.id, body),
    );
  }

  @Post('change-password')
  @ApiBearerAuth(NAME.JWT)
  @UseGuards(OAuthGuard)
  async changePassword(
    @Req() req: RequestHeaderType<User>,
    @Body() body: ChangePasswordDTO,
  ) {
    await this.authService.changePassword(req.user.id, body);
    return jsonResponse([]);
  }
}
