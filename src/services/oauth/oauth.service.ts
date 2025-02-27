import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDTO } from 'src/api/auth/dto';
import { HashHelper } from 'src/helpers';
import { User } from 'src/api/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { aesEncode } from 'src/utils';

@Injectable()
export class OAthService {
  private hashHelper = new HashHelper();
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async login(body: LoginDTO) {
    const user = await this.userRepo.findOneBy({ email: body.email });
    if (!user) throw new NotFoundException('Email not found');
    if (!user.active) throw new ForbiddenException('User is deactivated');
    if (!(await this.hashHelper.compare(body.password, user.password))) {
      throw new ForbiddenException('Password wrong');
    }
    delete user.password;
    return Object.assign(user, {
      token: await this.createToken(user),
    });
  }
  createToken(user: User) {
    return this.jwtService.signAsync(
      { code: aesEncode(String(user.id)) },
      {
        expiresIn: process.env.JWT_EXPIRED_IN,
        secret: process.env.JWT_SECRET_KEY,
      },
    );
  }
  async onUser(id: number, withPassword = false) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: {
        media: true,
        roles: {
          permissions: true,
        },
      },
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
