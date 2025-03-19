import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { jsonResponse } from 'src/commons';
import { SWAGGER_TAG } from 'src/constants';
import { Order, OrderDelivery } from './entities';

@Controller('orders-status')
@ApiTags(SWAGGER_TAG.Orders)
export class OrdersStatusController {
  @Get('status')
  findAllStatus() {
    return jsonResponse(Order.getStatusArray());
  }
  @Get('delivery-status')
  findAllDeliveryStatus() {
    return jsonResponse(OrderDelivery.getDeliveryStatusArray());
  }
}
