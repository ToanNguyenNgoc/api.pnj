import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { HashHelper } from '../../helpers';
import { Permission } from '../permissions/entities/permission.entity';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME } from 'src/constants';
import { AdminConsumer } from './admin.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, User]),
    BullModule.registerQueue({
      name: QUEUE_NAME.province,
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, HashHelper, AdminConsumer],
})
export class AdminModule {}
