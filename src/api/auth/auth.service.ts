import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  ChangePasswordDTO,
  RegisterProfileDTO,
  ResendMailVerificationDTO,
  UpdateProfileDTO,
  VerificationRegisterDTO,
} from './dto';
import { BaseService, GetMediaService, OAthService } from 'src/services';
import { HashHelper } from 'src/helpers';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { Queue } from 'bull';

@Injectable()
export class AuthService extends BaseService<User> {
  private hashHelper = new HashHelper();
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly getMediaService: GetMediaService,
    private readonly oauthService: OAthService,
    @InjectQueue(QUEUE_NAME.send_mail)
    private readonly sendMail: Queue,
  ) {
    super(userRepo);
  }
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

  async register(body: RegisterProfileDTO) {
    await this.oauthService.validateMailExist(body.email);
    if (body.telephone) {
      await this.oauthService.validateTelephoneExist(body.telephone);
    }
    await this.sendMail.add(
      { email: body.email, template: 'verification-register' },
      { delay: 1000 },
    );
    return this.createData(User, {
      ...body,
      password: await this.hashHelper.hash(body.password),
    });
  }
  async verification(body: VerificationRegisterDTO) {
    const { data, dateValid } = this.hashHelper.compareVerificationCode(
      body.code,
    );
    if (!data) throw new BadRequestException('Invalid verification code');
    if (!dateValid)
      throw new BadRequestException('The verification code has expired');
    const user = await this.userRepo.findOne({ where: { email: data.email } });
    if (user.active) throw new BadRequestException('User has been verified');
    user.active = true;
    await this.userRepo.save(user);
    return;
  }
  async resendVerification(body: ResendMailVerificationDTO) {
    const user = await this.userRepo.findOne({ where: { email: body.email } });
    if (!user) throw new BadRequestException('Email not found');
    if (user.active) throw new BadRequestException('User has been verified');
    await this.sendMail.add(
      { email: body.email, template: 'verification-register' },
      { delay: 1000 },
    );
    return;
  }
}
