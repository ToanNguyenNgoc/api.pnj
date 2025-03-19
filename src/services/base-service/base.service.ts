/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/api/users/entities/user.entity';
import { BaseQuery } from 'src/commons';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  Like,
  Repository,
} from 'typeorm';

interface DetailOptions {
  throwNotFound?: boolean;
  onlyData?: boolean;
  allowSlugify?: boolean;
}
@Injectable()
export class BaseService<T> {
  constructor(private readonly repository: Repository<T>) {}
  async paginate(options: BaseQuery, queryOptions?: FindManyOptions<T>) {
    const { page = 1, limit = 15 } = options;
    const skip = (page - 1) * limit;
    const order = { createdAt: 'DESC' } as unknown as FindOptionsOrder<T>;
    const [data, total] = await this.repository.findAndCount({
      order,
      ...queryOptions,
      skip,
      take: limit,
    });

    return {
      statusCode: 200,
      message: '',
      context: {
        data: data,
        total: total,
        total_page: Math.ceil(total / limit),
        prev_page: page - 1 > 0 ? page - 1 : 0,
        current_page: Number(page || 1),
        next_page:
          page + 1 > Math.ceil(total / limit)
            ? Math.ceil(total / limit)
            : page + 1,
      },
    };
  }
  async detail(
    id: any,
    options?: DetailOptions,
    queryOptions?: FindOneOptions<T>,
  ) {
    const data = await this.repository.findOne({
      where: [
        { id },
        options?.allowSlugify ? { name_slugify: id } : undefined,
      ] as any,
      ...queryOptions,
    });
    if (!data && options?.throwNotFound) {
      throw new NotFoundException('Resource not found');
    }
    if (data && this.repository.metadata.target === User) {
      delete (data as User).password;
    }
    if (options?.onlyData) {
      return data;
    } else {
      return {
        statusCode: 200,
        message: '',
        context: data,
      };
    }
  }
  async createData<T>(entityClass: { new (): T }, body: Partial<T>) {
    const data = Object.assign(new entityClass(), body);
    return {
      statusCode: 200,
      message: '',
      context: (await this.repository.save(data as any)) as T,
    };
  }
  async findAndUpdate<T extends Record<string, any>>(
    id: number,
    body: Partial<T>,
  ) {
    const data = await this.repository.findOne({ where: { id } as any });
    if (!data) throw new NotFoundException('Resource not found');
    const updatedData = Object.assign(data, body);
    if (data && this.repository.metadata.target === User) {
      delete (data as User).password;
    }
    return {
      statusCode: 200,
      message: '',
      context: await this.repository.save(updatedData, { reload: true }),
    };
  }
  async softDelete(id: number) {
    await this.repository.softDelete(id);
    return {
      statusCode: 204,
      message: 'Deleted',
    };
  }
  getLike(keyword?: string) {
    return keyword ? Like(`%${keyword}%`) : undefined;
  }
  getFilter<Filter>(filter: Filter) {
    return Object.fromEntries(
      Object.entries(filter)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key, value]) => [
          key,
          value === 'true' ? true : value === 'false' ? false : value,
        ]),
    );
  }
  getSort(sort?: string) {
    if (!sort) return undefined;
    return { [sort.replace('-', '')]: sort.includes('-') ? 'DESC' : 'ASC' };
  }
  getBoolean(val?: any) {
    if (!val) return;
    return val === 'false' ? false : true;
  }
  getIncludes(key: string, relations?: string) {
    if (!relations) return undefined;
    return relations.split('|').includes(key);
  }
}
