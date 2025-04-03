import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDTO, RefreshDto } from 'src/api/auth/dto';
import { HashHelper } from 'src/helpers';
import { User } from 'src/api/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { aesDecode, aesEncode } from 'src/utils';
import moment from 'moment';
import { Request } from 'express';

@Injectable()
export class OAthService {
  private hashHelper = new HashHelper();
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async login(body: LoginDTO, request: Request) {
    if (body.email == null) {
      throw new BadRequestException();
    }
    const user = await this.userRepo.findOne({
      where: [{ email: body.email }, { telephone: body.email }],
      relations: { roles: true },
    });
    if (!user) throw new NotFoundException('Email not found');
    if (!user.active) throw new ForbiddenException('User is deactivated');
    if (!(await this.hashHelper.compare(body.password, user.password))) {
      throw new ForbiddenException('Password wrong');
    }
    const role = user.roles.length > 0;
    delete user.password;
    delete user.roles;
    const refresh_token = aesEncode(
      JSON.stringify({ id: user.id, agent: request.headers['user-agent'] }),
    );

    return Object.assign(user, {
      role,
      token: await this.createToken(user),
      token_expired_at: moment()
        .add('minutes', 2)
        .format('YYYY-MM-DD HH:mm:ss'),
      refresh_token,
    });
  }
  async refresh(body: RefreshDto, request: Request) {
    let dataDecode;
    let user: User;
    try {
      dataDecode = JSON.parse(aesDecode(body.refresh));
      if (
        dataDecode.agent !== request.headers['user-agent'] ||
        !dataDecode.id
      ) {
        throw new ForbiddenException();
      }
      user = await this.userRepo.findOne({
        where: { id: dataDecode.id },
      });
      if (!user) throw new ForbiddenException();
    } catch (_error) {
      throw new ForbiddenException();
    }
    return {
      token: await this.createToken(user),
      token_expired_at: moment()
        .add('minutes', 2)
        .format('YYYY-MM-DD HH:mm:ss'),
    };
  }
  createToken(user: User, expiresIn = process.env.JWT_EXPIRED_IN) {
    return this.jwtService.signAsync(
      { code: aesEncode(String(user.id)) },
      {
        expiresIn,
        secret: process.env.JWT_SECRET_KEY,
      },
    );
  }
  async onUserToken(token: string) {
    let user: User;
    try {
      const code = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      const id = aesDecode(code.code);
      user = await this.userRepo.findOne({
        where: { id },
        select: User.select,
        relations: { roles: true },
      });
    } catch (error) {}
    return user;
  }
  async onUser(id: number, withPassword = false) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { media: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!withPassword) {
      delete user.password;
    }
    return user;
  }
  async validateMailExist(email?: string) {
    if (!email) return true;
    const user = await this.userRepo.findOneBy({ email });
    if (user) throw new BadRequestException('Email already exists');
    return true;
  }
  async validateTelephoneExist(telephone?: string) {
    if (!telephone) return true;
    const user = await this.userRepo.findOneBy({ telephone });
    if (user) throw new BadRequestException('Telephone already exists');
    return true;
  }
}
