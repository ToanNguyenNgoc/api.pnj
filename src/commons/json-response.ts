import { NotFoundException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

export async function jsonResponse<T>(
  queryBuilder: SelectQueryBuilder<T>,
  pagination?: { page?: number; limit?: number },
) {
  let context;
  if (pagination) {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 15;
    const [data, total] = await queryBuilder
      .offset(page * limit - limit)
      .limit(limit)
      .getManyAndCount();
    context = {
      data: data,
      total: total,
      total_page: Math.ceil(total / limit),
      prev_page: page - 1 > 0 ? page - 1 : 0,
      current_page: page,
      next_page:
        page + 1 > Math.ceil(total / limit)
          ? Math.ceil(total / limit)
          : page + 1,
    };
  } else {
    context = await queryBuilder.getOne();
    if (!context) throw new NotFoundException('Resource not found');
  }
  return {
    statusCode: 200,
    message: '',
    context,
  };
}
