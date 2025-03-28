import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { CacheableMemory } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';

export const cacheConfig: CacheModuleAsyncOptions<Record<string, any>> = {
  isGlobal: true,
  useFactory: async () => {
    return {
      stores: [
        new Keyv({
          store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
        }),
        createKeyv(
          `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        ),
      ],
    };
  },
};
