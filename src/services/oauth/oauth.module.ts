import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/api/permissions/entities/permission.entity';
import { Role } from 'src/api/roles/entities/role.entity';
import { User } from 'src/api/users/entities/user.entity';
import { OAthService } from './oauth.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  providers: [OAthService],
  exports: [OAthService],
})
export class OAuthModule {}
