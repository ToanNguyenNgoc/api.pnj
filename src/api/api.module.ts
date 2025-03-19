import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { BannersModule } from './banners/banners.module';
import { CategoriesModule } from './categories/categories.module';
import { AdminModule } from './admin/admin.module';
import { GetMediaModule, OAuthModule } from 'src/services';
import { AuthStrategy } from 'src/middlewares';
import { MediaModule } from './media/media.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Media } from './media/entities';
import { ProductModule } from './product/product.module';
import { ProvincesModule } from './provinces/provinces.module';
import { UserAddressesModule } from './user-addresses/user-addresses.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { OrdersModule } from './orders/orders.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PaymentGatewaysModule } from './payment-gateways/payment-gateways.module';
import { AdminOrdersModule } from './admin-orders/admin-orders.module';
import { BlogsModule } from './blogs/blogs.module';
import { BlogCategoriesModule } from './blog-categories/blog-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Media]),
    OAuthModule,
    GetMediaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    BannersModule,
    CategoriesModule,
    BlogCategoriesModule,
    ProductModule,
    BlogsModule,
    ProvincesModule,
    UserAddressesModule,
    PaymentMethodsModule,
    OrdersModule,
    AdminModule,
    AdminOrdersModule,
    RolesModule,
    MediaModule,
    PermissionsModule,
    PaymentGatewaysModule,
  ],
  providers: [AuthStrategy],
})
export class ApiModule {}
