import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NAME, SWAGGER_TAG } from 'src/constants';
import { QrProductDto } from './dto';
import { OAuthGuard, RoleGuard } from 'src/middlewares';
import { Roles } from 'src/decorators';

@Controller('product')
@ApiTags(SWAGGER_TAG.Product)
@ApiBearerAuth(NAME.JWT)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.product.post')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() query: QrProductDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.product.:id.patch')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(OAuthGuard, RoleGuard)
  @Roles('.product.:id.delete')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
