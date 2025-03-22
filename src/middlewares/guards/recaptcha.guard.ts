import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ReCaptchaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body, ip } = request;
    const recaptcha = body.recaptcha;
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (
      process.env.APP_MODE === 'develop' ||
      recaptcha === process.env.RECAPTCHA_SITE_KEY
    ) {
      return true;
    }
    if (!recaptcha) {
      throw new BadRequestException('Recaptcha token is missing!');
    }
    try {
      const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}&remoteip=${ip}`;
      const response = await axios.post(
        verificationURL,
        {},
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      if (!response.data.success) {
        throw new BadRequestException('Recaptcha is invalid!');
      }
      return true;
    } catch (error) {
      throw new BadRequestException('Recaptcha verification failed!');
    }
  }
}
