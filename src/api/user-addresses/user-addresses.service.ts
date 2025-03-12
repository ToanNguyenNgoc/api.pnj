import { Injectable } from '@nestjs/common';
import { CreateUserAddressDto, UpdateUserAddressDto } from './dto';
import { BaseService } from 'src/services';
import { UserAddress } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProvinceHelper } from 'src/helpers';
import { User } from '../users/entities/user.entity';
import { BaseQuery } from 'src/commons';

@Injectable()
export class UserAddressesService extends BaseService<UserAddress> {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepo: Repository<UserAddress>,
    private readonly provinceHelper: ProvinceHelper,
  ) {
    super(userAddressRepo);
  }
  async create(user: User, body: CreateUserAddressDto) {
    const addressCount = await this.userAddressRepo.count({
      where: { user: { id: user.id } },
    });
    const province = await this.provinceHelper.onProvince(body.province_code);
    const district = await this.provinceHelper.onDistrict(body.district_code);
    const ward = await this.provinceHelper.onWard(body.ward_code);
    const address = await this.createData(UserAddress, {
      ...body,
      user,
      province: [province],
      district: [district],
      ward: [ward],
      is_default: addressCount === 0 ? true : false,
    });
    delete address.context.user;
    return address;
  }

  findAll(user: User, query: BaseQuery) {
    return this.paginate(query, {
      where: { user: { id: user.id } },
      relations: { province: true, district: true, ward: true, user: true },
      select: { user: User.select },
    });
  }

  findOne(user: User, id: number) {
    return this.detail(
      id,
      { throwNotFound: true },
      {
        where: { user: { id: user.id }, id },
        relations: { province: true, district: true, ward: true, user: true },
        select: { user: User.select },
      },
    );
  }

  async update(user: User, id: number, body: UpdateUserAddressDto) {
    await this.findOne(user, id);
    if (body.is_default) {
      await this.userAddressRepo.update(
        { user: { id: user.id }, id },
        { is_default: false },
      );
    }
    return this.findAndUpdate(id, {
      short_address: body.short_address,
      is_default: body.is_default,
      is_bookmark: body.consignee_s_name,
      consignee_s_name: body.consignee_s_name,
      consignee_s_telephone: body.consignee_s_telephone,
      province: body.province_code
        ? [await this.provinceHelper.onProvince(body.province_code)]
        : undefined,
      district: body.district_code
        ? [await this.provinceHelper.onDistrict(body.district_code)]
        : undefined,
      ward: body.ward_code
        ? [await this.provinceHelper.onWard(body.ward_code)]
        : undefined,
    });
  }

  async remove(user: User, id: number) {
    await this.findOne(user, id);
    return this.softDelete(id);
  }
}
