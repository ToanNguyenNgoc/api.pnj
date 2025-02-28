import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { HashHelper } from 'src/helpers';
import { BaseService, GetMediaService, OAthService } from 'src/services';
import { Role } from '../roles/entities/role.entity';
import { QueryUser } from './dto';

@Injectable()
export class UsersService extends BaseService<User> {
  private hashHelper = new HashHelper();
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly oathService: OAthService,
    private readonly getMediaService: GetMediaService,
  ) {
    super(userRepo);
  }
  async create(createUserDto: CreateUserDto) {
    await this.oathService.validateMailExist(createUserDto.email);
    await this.oathService.validateTelephoneExist(createUserDto.telephone);
    const roles = await this.roleRepo.find({
      where: { id: In(createUserDto.role_ids) },
    });
    const media = await this.getMediaService.getOne(createUserDto.media_id);
    return this.createData(
      User,
      Object.assign(createUserDto, {
        password: await this.hashHelper.hash(createUserDto.password),
        roles,
        media: createUserDto.media_id ? media : undefined,
        active: true,
      }),
    );
  }
  async findAll(query: QueryUser) {
    return await this.paginate(query, {
      where: ['fullname', 'email', 'telephone'].map((i) =>
        this.getFilter({
          [i]: this.getLike(query.search),
          active: query.active,
          roles: { name: this.getLike(query.role) },
        }),
      ),
      order: this.getSort(query.sort),
      select: User.select,
      relations: { roles: true, media: true },
    });
  }

  async findOne(id: number) {
    return this.detail(
      id,
      { throwNotFound: true },
      {
        relations: { roles: { permissions: true }, media: true },
      },
    );
  }

  async update(id: number, body: UpdateUserDto) {
    await this.oathService.validateMailExist(body.email);
    await this.oathService.validateTelephoneExist(body.telephone);
    const roles = await this.roleRepo.find({
      where: { id: In(body.role_ids) },
    });
    const media = await this.getMediaService.getOne(body.media_id);
    return this.findAndUpdate<UpdateUserDto>(
      id,
      Object.assign(body, {
        roles: roles,
        media,
        password: body.password
          ? await this.hashHelper.hash(body.password)
          : undefined,
      }),
    );
  }

  remove(id: number) {
    return this.softDelete(id);
  }
}
