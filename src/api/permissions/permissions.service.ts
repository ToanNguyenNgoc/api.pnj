/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { jsonResponse } from 'src/commons';
import { permissionsArray } from 'src/commons';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}
  create(createPermissionDto: CreatePermissionDto) {
    return 'This action adds a new permission';
  }

  async findAll() {
    for (const item of permissionsArray) {
      if (!(await this.permissionRepo.findOneBy({ name: item }))) {
        const permission = this.permissionRepo.create({
          name: item,
          guard_name: 'api',
        });
        await this.permissionRepo.save(permission);
      }
    }
    const page = 1;
    const limit = 5;
    const permissions = this.permissionRepo.createQueryBuilder('tb_permission');
    return jsonResponse(permissions, {});
  }

  findOne(id: number) {
    return jsonResponse(
      this.permissionRepo.createQueryBuilder('tb_permission').where({ id: id }),
    );
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
