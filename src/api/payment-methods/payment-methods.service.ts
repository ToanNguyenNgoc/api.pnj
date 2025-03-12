import { Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto, UpdatePaymentMethodDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities';
import { Repository } from 'typeorm';
import { BaseService } from 'src/services';

@Injectable()
export class PaymentMethodsService extends BaseService<PaymentMethod> {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
  ) {
    super(paymentMethodRepo);
  }
  create(createPaymentMethodDto: CreatePaymentMethodDto) {
    return 'This action adds a new paymentMethod';
  }

  findAll() {
    return this.paginate({});
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentMethod`;
  }

  update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return `This action updates a #${id} paymentMethod`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMethod`;
  }
}
