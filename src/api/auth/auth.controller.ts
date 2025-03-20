import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { OAthService } from 'src/services';
import {
  ChangePasswordDTO,
  ForgotDto,
  LoginDTO,
  RefreshDto,
  RegisterProfileDTO,
  ResendMailVerificationDTO,
  UpdateProfileDTO,
  VerificationRegisterDTO,
} from './dto';
import { jsonResponse } from 'src/commons';
import { OAuthGuard } from 'src/middlewares';
import { RequestHeaderType } from 'src/types';
import { User } from '../users/entities/user.entity';
import { Request } from 'express';

@ApiTags(SWAGGER_TAG.Auth)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly oauthService: OAthService,
  ) {}

  @Post('login')
  async login(@Req() request: Request, @Body() body: LoginDTO) {
    return jsonResponse(await this.oauthService.login(body, request));
  }
  @Get('profile')
  @ApiBearerAuth(NAME.JWT)
  @UseGuards(OAuthGuard)
  async profile(@Req() req: RequestHeaderType<User>) {
    return jsonResponse(await this.oauthService.onUser(req.user.id));
  }

  @Put('profile')
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

  @Post('register')
  async register(@Body() body: RegisterProfileDTO) {
    return this.authService.register(body);
  }

  @ApiExcludeEndpoint()
  @Post('verification')
  async verification(@Body() body: VerificationRegisterDTO) {
    await this.authService.verification(body);
    return jsonResponse([]);
  }

  @ApiExcludeEndpoint()
  @Post('verification-resend')
  async resendVerification(@Body() body: ResendMailVerificationDTO) {
    await this.authService.resendVerification(body);
    return jsonResponse([]);
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Body() body: RefreshDto) {
    return jsonResponse(await this.oauthService.refresh(body, request));
  }
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotDto) {
    return this.authService.forgotPassword(body);
  }
}
