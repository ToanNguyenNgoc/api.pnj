import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

export class CacheService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  async getData<T>(key: string) {
    const data = (await this.cacheManager.get(key)) as T;
    return data;
  }
  async setData<T>(key: string, value: T) {
    try {
      await this.cacheManager.set(key, value);
    } catch (error) {}
  }
  async deleteData(key: string) {
    await this.cacheManager.del(key);
  }
  async clearData() {
    await this.cacheManager.clear();
  }
}
