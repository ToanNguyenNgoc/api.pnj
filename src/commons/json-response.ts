import { NotFoundException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

export function jsonResponse<T>(data: T, message?: string) {
  return {
    statusCode: 200,
    message,
    context: data,
  };
}

import { Repository, FindManyOptions } from 'typeorm';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export async function paginate<T>(
  repository: Repository<T>,
  options: PaginationOptions,
  queryOptions?: FindManyOptions<T>,
) {
  const { page = 1, limit = 15 } = options;
  const skip = (page - 1) * limit;

  const [data, total] = await repository.findAndCount({
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
      current_page: page,
      next_page:
        page + 1 > Math.ceil(total / limit)
          ? Math.ceil(total / limit)
          : page + 1,
    },
  };
}
