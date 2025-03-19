import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemDto } from 'src/api/orders/dto';
import { Order, OrderDelivery, OrderItem } from 'src/api/orders/entities';
import { PaymentMethod } from 'src/api/payment-methods/entities';
import { Product, ProductItem } from 'src/api/product/entities';
import { UserAddress } from 'src/api/user-addresses/entities';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class CalculateOrderHelper {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepo: Repository<PaymentMethod>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(UserAddress)
    private readonly userAddressRepo: Repository<UserAddress>,
    @InjectRepository(OrderDelivery)
    private readonly orderDeliveryRepo: Repository<OrderDelivery>,
  ) {}
  async onPaymentMethod(payment_method_id?: number) {
    if (!payment_method_id) return;
    const paymentMethod = await this.paymentMethodRepo.findOneBy({
      id: payment_method_id,
    });
    if (!paymentMethod) throw new NotFoundException('Payment method not found');
    return paymentMethod;
  }
  async onUserAddress(user_id: number, user_address_id: number) {
    const address = await this.userAddressRepo.findOne({
      where: {
        user: { id: user_id },
        id: user_address_id,
      },
      relations: { province: true, district: true, ward: true },
    });
    if (!address) throw new NotFoundException('User address method not found');
    if (!address.is_default)
      throw new ForbiddenException('User address must be default');
    const full_address = `${address.short_address}, ${address.ward?.name}, ${address.district?.name}, ${address.province?.name}`;
    return { address, full_address };
  }
  async onSaveDeliveryAddress(user_id: number, user_address_id: number) {
    const { address, full_address } = await this.onUserAddress(
      user_id,
      user_address_id,
    );
    const orderDelivery = new OrderDelivery();
    orderDelivery.full_address = full_address;
    orderDelivery.consignee_s_name = address.consignee_s_name;
    orderDelivery.consignee_s_telephone = address.consignee_s_telephone;
    orderDelivery.userAddress = address;
    orderDelivery.province = address.province;
    orderDelivery.district = address.district;
    orderDelivery.ward = address.ward;
    return this.orderDeliveryRepo.save(orderDelivery);
  }
  async onProducts(order: Order, products: OrderItemDto[]) {
    const productsData: Product[] = [];
    const orderItems: DeepPartial<OrderItem>[] = [];
    let amount = 0;
    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      const product = await this.onProduct(item.id);
      let price = product.special_price * item.quantity;
      let productItem: ProductItem;
      if (item.product_item_id) {
        productItem = product.items.find(
          (pdItem) => pdItem.id === item.product_item_id,
        );
        if (!productItem) {
          throw new NotFoundException(
            `Not found product item with product_item_id: ${item.product_item_id} with id: ${item.id}`,
          );
        }
        price = productItem.special_price * item.quantity;
      }
      productsData.push(product);
      orderItems.push({
        order,
        product: product,
        productItem,
        product_name: product.name,
        product_name_item: productItem?.name,
        base_price: price,
        quantity: item.quantity,
      });
      amount += price;
    }
    return {
      productsData,
      amount,
      orderItems,
    };
  }
  async onProduct(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: { items: true },
    });
    if (!product)
      throw new NotFoundException(`Not found product with id: ${id}`);
    return product;
  }
}
