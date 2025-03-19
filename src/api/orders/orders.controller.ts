import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { jsonResponse } from 'src/commons';
import { OAuthGuard } from 'src/middlewares';
import { RequestHeaderType } from 'src/types';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto, OrderQuery } from './dto';

@Controller('orders')
@ApiTags(SWAGGER_TAG.Orders)
@ApiBearerAuth(NAME.JWT)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(OAuthGuard)
  async create(
    @Req() request: RequestHeaderType<User>,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return jsonResponse(
      await this.ordersService.create(request.user, createOrderDto),
    );
  }

  @Get()
  @UseGuards(OAuthGuard)
  findAll(@Req() request: RequestHeaderType<User>, @Query() qr: OrderQuery) {
    return this.ordersService.findAll(qr, request.user);
  }

  @Get(':id')
  @UseGuards(OAuthGuard)
  findOne(@Param('id') id: string, @Req() request: RequestHeaderType<User>) {
    return this.ordersService.findOne(id, request.user);
  }

  @Patch(':id')
  @UseGuards(OAuthGuard)
  @ApiExcludeEndpoint()
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }
}
