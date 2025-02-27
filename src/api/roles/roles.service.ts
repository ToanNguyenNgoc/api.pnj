import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRoleDto } from './dto';
import { Permission } from '../permissions/entities/permission.entity';
import { BaseService } from 'src/services';

@Injectable()
export class RolesService extends BaseService<Role> {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {
    super(roleRepo);
  }

  async findAll() {
    return this.paginate({ limit: 100 });
  }
  async findOne(id: number) {
    return this.detail(
      id,
      { throwNotFound: true },
      { relations: { permissions: true } },
    );
  }
  async create(body: CreateRoleDto) {
    if (await this.roleRepo.findOneBy({ name: body.name })) {
      throw new BadRequestException('Role name already exists');
    }
    const permissions = await this.permissionRepo.find({
      where: { id: In(body.permission_ids) },
    });
    return this.createData(Role, {
      name: body.name,
      permissions,
      guard_name: 'api',
    });
  }
  async update(id: number, body: CreateRoleDto) {
    const permissions = await this.permissionRepo.find({
      where: { id: In(body.permission_ids) },
    });
    return this.findAndUpdate(id, {
      name: body.name,
      permissions,
    });
  }
  async remove(id: number) {
    return this.softDelete(id);
  }
}
