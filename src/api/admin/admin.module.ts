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
import { PaymentMethod } from '../payment-methods/entities';
import { Topic } from '../topics/entities';
import { Message } from '../messages/entities/message.entity';
import { PaypalService, StripeService } from 'src/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Permission,
      User,
      PaymentMethod,
      Topic,
      Message,
    ]),
    BullModule.registerQueue({
      name: QUEUE_NAME.province,
    }),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    HashHelper,
    AdminConsumer,
    PaypalService,
    StripeService,
  ],
})
export class AdminModule {}
