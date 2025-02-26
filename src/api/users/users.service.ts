import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { paginate } from 'src/commons';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  create(_createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await paginate(
      this.userRepo,
      { page: 1, limit: 15 },
      {
        select: [
          'active',
          'birthday',
          'createdAt',
          'deletedAt',
          'email',
          'fullname',
          'gender',
          'id',
          'media',
          'roles',
          'telephone',
          'updatedAt',
        ],
      },
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, _updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
