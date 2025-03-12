import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District, Province, Ward } from 'src/api/provinces/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ProvinceHelper {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepo: Repository<Province>,
    @InjectRepository(District)
    private readonly districtRepo: Repository<District>,
    @InjectRepository(Ward)
    private readonly wardRepo: Repository<Ward>,
  ) {}
  async onProvince(province_code?: number) {
    if (!province_code) return undefined;
    const province = await this.provinceRepo.findOneBy({ code: province_code });
    if (!province) throw new NotFoundException('Province not found');
    return province;
  }
  async onDistrict(district_code?: number) {
    if (!district_code) return undefined;
    const district = await this.districtRepo.findOneBy({ code: district_code });
    if (!district) throw new NotFoundException('District not found');
    return district;
  }
  async onWard(ward_code?: number) {
    if (!ward_code) return undefined;
    const ward = await this.wardRepo.findOneBy({ code: ward_code });
    if (!ward) throw new NotFoundException('Ward not found');
    return ward;
  }
}
