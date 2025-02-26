import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/api/users/entities/user.entity';
import { NAME } from 'src/constants';
import { aesDecode } from 'src/utils';
import { Repository } from 'typeorm';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, NAME.JWT) {
  constructor(
    @InjectRepository(User)
    private readonly useRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }
  async validate(payload: any) {
    const user_id = aesDecode(payload.code);
    const user = await this.useRepo.findOne({
      where: { id: user_id },
      relations: {
        roles: {
          permissions: true,
        },
      },
    });
    return user;
  }
}
