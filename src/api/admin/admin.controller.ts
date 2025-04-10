import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { Roles } from 'src/decorators';
import { jsonResponse } from 'src/commons';

@ApiTags(SWAGGER_TAG.Admin)
@Controller('admin')
// @UseGuards(OAuthGuard)
// @ApiBearerAuth(NAME.JWT)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Post()
  // create(@Body() createAdminDto: CreateAdminDto) {
  //   return this.adminService.create(createAdminDto);
  // }

  @Post('instance')
  instance() {
    return this.adminService.instance();
  }

  @Post('clear-topic')
  @UseGuards(RoleGuard)
  @Roles('.topics.:id.delete')
  clearMessage() {
    this.adminService.clearMessage();
    return jsonResponse([]);
  }
  //
  @Post('test-paypal')
  @ApiExcludeEndpoint()
  testPaypal() {
    return this.adminService.testPaypal();
  }
  @Get('test-paypal/:order_id')
  @ApiExcludeEndpoint()
  testPaypalCapturePayment(@Param('order_id') order_id: string) {
    return this.adminService.testPaypalCapturePayment(order_id);
  }
  //
  @Post('test-stripe')
  testStripe() {
    return this.adminService.testStripe();
  }
  @Get('test-stripe/:order_id')
  testStripeCheckoutSession(@Param('order_id') order_id: string) {
    return this.adminService.testStripeCheckoutSession();
  }
}
