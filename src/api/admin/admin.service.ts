import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { HashHelper } from '../../helpers';
import { jsonResponse } from 'src/commons';
import { Permission } from '../permissions/entities/permission.entity';
import { permissionsArray } from 'src/commons';
import { PaymentMethod } from '../payment-methods/entities';
import { Topic } from '../topics/entities';
import { Message } from '../messages/entities/message.entity';
import { PaypalService, StripeService } from 'src/services';

@Injectable()
export class AdminService {
  private hashHelper = new HashHelper();
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(Topic)
    private readonly topicRepo: Repository<Topic>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly paypalService: PaypalService,
    private readonly stripeService: StripeService,
  ) {}
  async instance() {
    const role = await this.roleRepo.findOneBy({ name: User.SUPER_ADMIN });
    if (!role) {
      await this.roleRepo.save(
        this.roleRepo.create({ name: User.SUPER_ADMIN, guard_name: 'api' }),
      );
    }
    for (const item of permissionsArray) {
      if (!(await this.permissionRepo.findOneBy({ name: item }))) {
        const permission = this.permissionRepo.create({
          name: item,
          guard_name: 'api',
        });
        await this.permissionRepo.save(permission);
      }
    }
    if (
      !(await this.userRepo.findOneBy({
        email: process.env.APP_SPA_MAIL,
      }))
    ) {
      const user = new User();
      user.email = process.env.APP_SPA_MAIL;
      user.password = await this.hashHelper.hash(
        String(process.env.APP_SPA_PASSWORD),
      );
      user.fullname = process.env.APP_SPA_MAIL;
      user.roles = await this.roleRepo.findBy({ name: User.SUPER_ADMIN });
      user.active = true;
      await this.userRepo.save(user);
    }
    PaymentMethod.toMethodArray().forEach(async (item) => {
      const method = await this.paymentMethodRepo.findOne({
        where: { method: item.method },
      });
      if (!method) {
        const methodData = Object.assign(new PaymentMethod(), item);
        await this.paymentMethodRepo.save(methodData);
      }
    });
    return jsonResponse([], 'Instance successfully');
  }

  async clearMessage() {
    await this.messageRepo.delete({});
    await this.topicRepo.delete({});
  }

  async testPaypal() {
    const response = await this.paypalService.createOrder();
    return jsonResponse(response);
  }
  async testPaypalCapturePayment(orderId: string) {
    const response = await this.paypalService.capturePayment(orderId);
    return jsonResponse(response);
  }
  async testStripe() {
    // const response = await this.stripeService.createSession();
    return jsonResponse([]);
  }
  async testStripeCheckoutSession() {
    // const response = await this.stripeService.checkoutSession(orderId);
    return jsonResponse([]);
  }
}
