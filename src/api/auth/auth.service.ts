/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import {
  ChangePasswordDTO,
  ForgotDto,
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
import { random } from 'src/utils';
import { Otp } from './entities';
import moment from 'moment';
import { jsonResponse } from 'src/commons';

@Injectable()
export class AuthService extends BaseService<User> {
  private hashHelper = new HashHelper();
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
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
    const token = body.code;
    const email = await this.hashHelper.getEmail(token);
    const user = await this.userRepo.findOne({ where: { email } });
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
  async forgotPassword(body: ForgotDto) {
    if (!body.otp && !body.password) {
      const user = await this.userRepo.findOne({
        where: { email: body.email, active: true },
      });
      if (!user) throw new BadRequestException('Email not found');
      const otpCode = random();
      const otp = new Otp();
      otp.code = otpCode;
      otp.email = body.email;
      otp.expired_at = moment().add('minutes', 5).toDate();
      await this.otpRepo.save(otp);
      await this.sendMail.add(
        { email: body.email, otp: otpCode, template: 'otp-mail' },
        { delay: 1000 },
      );
      return jsonResponse({ message: 'Send success' });
    }
    const otpDetail = await this.otpRepo.findOne({
      where: { code: body.otp, expired_at: MoreThan(new Date()) },
    });
    if (!otpDetail) throw new NotFoundException('OTP code is wrong');
    await this.userRepo
      .createQueryBuilder('tb_user')
      .where({ email: otpDetail.email, active: true })
      .update(User)
      .set({
        password: await this.hashHelper.hash(body.password),
      })
      .execute();
    await this.otpRepo.delete(otpDetail.id);
    return jsonResponse({ message: 'Update success' });
  }
}
