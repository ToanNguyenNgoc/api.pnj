import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ChangePasswordDTO, UpdateProfileDTO } from './dto';
import { GetMediaService, OAthService } from 'src/services';
import { HashHelper } from 'src/helpers';

@Injectable()
export class AuthService {
  private hashHelper = new HashHelper();
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly getMediaService: GetMediaService,
    private readonly oauthService: OAthService,
  ) {}
  async updateProfile(user_id: number, body: UpdateProfileDTO) {
    const { fullname, email, telephone, media_id, gender } = body;
    await this.oauthService.validateMailExist(email);
    await this.oauthService.validateTelephoneExist(body.telephone);
    const user = new User();
    user.fullname = fullname;
    user.email = email;
    user.telephone = telephone;
    user.media = media_id
      ? await this.getMediaService.getOne(body.media_id)
      : undefined;
    user.gender = gender;
    await this.userRepo.update(user_id, user);
    return this.oauthService.onUser(user_id);
  }
  async changePassword(user_id: number, body: ChangePasswordDTO) {
    const user = await this.oauthService.onUser(user_id, true);
    if (!(await this.hashHelper.compare(body.password, user.password))) {
      throw new ForbiddenException('Password wrong');
    }
    await this.userRepo.update(user_id, {
      password: await this.hashHelper.hash(body.new_password),
    });
    return body;
  }
}
