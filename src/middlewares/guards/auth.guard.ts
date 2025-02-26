import { AuthGuard } from '@nestjs/passport';
import { NAME } from 'src/constants';

export class OAuthGuard extends AuthGuard(NAME.JWT) {}
