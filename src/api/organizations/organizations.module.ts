import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../media/entities';
import { District, Province, Ward } from '../provinces/entities';
import { Organization, OrganizationContact } from './entities';
import { GetMediaService } from 'src/services';
import { ProvinceHelper } from 'src/helpers';
import { OrganizationContactController } from './organizations-contracts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Media,
      Province,
      District,
      Ward,
      Organization,
      OrganizationContact,
    ]),
  ],
  controllers: [OrganizationsController, OrganizationContactController],
  providers: [OrganizationsService, GetMediaService, ProvinceHelper],
})
export class OrganizationsModule {}
