import { BullModuleOptions } from '@nestjs/bull';

export const bullConfig: BullModuleOptions = {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
  },
};
