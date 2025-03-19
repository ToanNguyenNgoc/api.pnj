import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { OrdersService } from '../orders/orders.service';
import { OrderItemDto, OrderQuery, UpdateOrderItemDto } from '../orders/dto';
import { Roles } from 'src/decorators';
import { UpdateOrderDto } from '../orders/dto/update-order.dto';
import { OAuthGuard, OrderPendingGuard, RoleGuard } from 'src/middlewares';

@Controller('admin/orders')
@ApiTags(SWAGGER_TAG.AdminOrder)
@ApiBearerAuth(NAME.JWT)
@UseGuards(OAuthGuard, RoleGuard)
export class AdminOrdersController {
  constructor(private readonly orderService: OrdersService) {}
  @Get()
  @Roles('.admin.orders.get')
  findAll(@Query() qr: OrderQuery) {
    return this.orderService.findAll(qr);
  }
  @Get(':id')
  @Roles('.admin.orders.:id.get')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OrderPendingGuard)
  @Roles('.admin.orders.:id.patch')
  update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.orderService.update(+id, body);
  }

  @Post(':id/items')
  @UseGuards(OrderPendingGuard)
  @Roles('.admin.orders.:id.patch')
  postItem(@Param('id') id: string, @Body() body: OrderItemDto) {
    return this.orderService.postItem(+id, body);
  }

  @Patch(':id/items/:item_id')
  @UseGuards(OrderPendingGuard)
  @Roles('.admin.orders.:id.patch')
  updateItem(
    @Param('id') id: string,
    @Param('item_id') item_id: string,
    @Body() body: UpdateOrderItemDto,
  ) {
    return this.orderService.updateItem(+id, +item_id, body);
  }

  @Delete(':id/items/:item_id')
  @UseGuards(OrderPendingGuard)
  @Roles('.admin.orders.:id.patch')
  deleteItem(@Param('id') id: string, @Param('item_id') item_id: string) {
    return this.orderService.deleteItem(+id, +item_id);
  }

  @Delete(':id')
  @UseGuards(OrderPendingGuard)
  @Roles('.admin.orders.:id.delete')
  delete(@Param('id') id: string) {
    return this.orderService.softDelete(+id);
  }
}
