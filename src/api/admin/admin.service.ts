import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { HashHelper } from '../../helpers';
import { jsonResponse } from 'src/commons';
import { Permission } from '../permissions/entities/permission.entity';
import { permissionsArray } from 'src/commons';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { Queue } from 'bull';
import { PaymentMethod } from '../payment-methods/entities';

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
    @InjectQueue(QUEUE_NAME.province)
    private readonly provinceQueue: Queue,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const data = { message: 'Instance province' };
    const result = await this.provinceQueue.add(data, { delay: 3000 });
    console.log(result);
    return 'This action adds a new admin';
  }
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
      await this.paymentMethodRepo.upsert(
        { name: item.name, method: item.method },
        ['method'],
      );
    });
    return jsonResponse([], 'Instance successfully');
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
