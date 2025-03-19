import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/api/orders/entities';
import { Repository } from 'typeorm';

@Injectable()
export class OrderPendingGuard implements CanActivate {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const order = await this.orderRepo.findOne({
      where: { id: Number(params.id) },
    });
    if (!order) throw new NotFoundException();
    const statusPending = Order.STATUS.PENDING.name;
    if (order.status !== statusPending) {
      throw new ForbiddenException(
        `Only update order when status = ${statusPending}`,
      );
    }
    return true;
  }
}
