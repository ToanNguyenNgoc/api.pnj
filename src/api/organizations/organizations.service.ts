import { Injectable } from '@nestjs/common';
import {
  CreateOrganizationDto,
  CreateOrgContactItemDto,
  UpdateOrgContactItemDto,
} from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization, OrganizationContact } from './entities';
import { In, Repository } from 'typeorm';
import { BaseService, GetMediaService } from 'src/services';
import { ProvinceHelper } from 'src/helpers';

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(OrganizationContact)
    private readonly orgContactRepo: Repository<OrganizationContact>,
    private readonly mediaService: GetMediaService,
    private readonly provinceHelper: ProvinceHelper,
  ) {
    super(orgRepo);
  }
  async create(body: CreateOrganizationDto) {
    const media = await this.mediaService.getOne(body.media_id);
    const province = await this.provinceHelper.onProvince(body.province_code);
    const district = await this.provinceHelper.onDistrict(body.district_code);
    const ward = await this.provinceHelper.onWard(body.ward_code);
    const organization = await this.createData(Organization, {
      name: body.name,
      short_address: body.short_address,
      media,
      province,
      district,
      ward,
    });
    await this.onSaveOrgContract(organization.context, body.contacts);
    return organization;
  }

  findAll() {
    return this.paginate(
      {},
      {
        relations: {
          media: true,
          contacts: true,
          province: true,
          district: true,
          ward: true,
        },
      },
    );
  }

  findOne(id: number) {
    return this.detail(
      id,
      { throwNotFound: true },
      {
        relations: {
          media: true,
          contacts: true,
          province: true,
          district: true,
          ward: true,
        },
      },
    );
  }

  async update(id: number, body: UpdateOrganizationDto) {
    const organization = await this.findAndUpdate(id, {
      name: body.name,
      short_address: body.short_address,
      active: body.active,
      media: await this.mediaService.getOne(body.media_id),
      province: body.province_code
        ? await this.provinceHelper.onProvince(body.province_code)
        : undefined,
      district: body.district_code
        ? await this.provinceHelper.onDistrict(body.district_code)
        : undefined,
      ward: body.ward_code
        ? await this.provinceHelper.onWard(body.ward_code)
        : undefined,
    });
    await this.onUpdateOrgContact(organization.context, body.contacts);
    return organization;
  }

  remove(id: number) {
    return this.softDelete(id);
  }
  async onSaveOrgContract(
    org: Organization,
    contacts: CreateOrgContactItemDto[],
  ) {
    await this.orgContactRepo.save(
      contacts.map((item) => ({
        organization: org,
        contact_type: item.contact_type,
        value: item.value,
        icon: item.icon,
      })),
    );
  }
  async onUpdateOrgContact(
    organization: Organization,
    contacts: UpdateOrgContactItemDto[] = [],
  ) {
    const orgContracts = await this.orgContactRepo.find({
      where: { organization: { id: organization.id } },
    });
    const orgContractIdDeleted = orgContracts
      .filter((item) => !contacts.map((i) => i.id).includes(item.id))
      .map((i) => i.id);
    await this.orgContactRepo.delete({ id: In(orgContractIdDeleted) });
    await this.onSaveOrgContract(
      organization,
      contacts.filter((i) => !i.id),
    );
    await Promise.all(
      contacts
        .filter((i) => i.id)
        .map(async (item) => {
          const dataItem = await this.orgContactRepo.findOne({
            where: { id: item.id },
          });
          if (!dataItem) return;
          await this.orgContactRepo.save(Object.assign(dataItem, item));
          return;
        }),
    );
  }
}
