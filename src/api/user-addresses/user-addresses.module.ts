import { Module } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { UserAddressesController } from './user-addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District, Province, Ward } from '../provinces/entities';
import { UserAddress } from './entities';
import { ProvinceHelper } from 'src/helpers';

@Module({
  imports: [TypeOrmModule.forFeature([Province, District, Ward, UserAddress])],
  controllers: [UserAddressesController],
  providers: [UserAddressesService, ProvinceHelper],
})
export class UserAddressesModule {}
