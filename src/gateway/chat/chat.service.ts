import { User } from 'src/api/users/entities/user.entity';
import { CACHE_KEY_NAME } from 'src/constants';
import { CacheService } from 'src/services';

export class ChatService {
  constructor(private readonly cacheService: CacheService) {}
  async getUserOnline() {
    console.log(this.cacheService);
    const users =
      (await this.cacheService.getData<User[]>(CACHE_KEY_NAME.user_online)) ||
      [];
    return users;
  }
  async setUserOnline(user: User) {
    const users = await this.getUserOnline();
    const iIndex = users.findIndex((i) => i.id === user.id);
    if (iIndex < 0) {
      await this.cacheService.setData(CACHE_KEY_NAME.user_online, [
        ...users,
        user,
      ]);
    }
    return;
  }
}
