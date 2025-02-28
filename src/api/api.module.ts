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

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Media]),
    OAuthModule,
    GetMediaModule,
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    BannersModule,
    CategoriesModule,
    AdminModule,
    MediaModule,
    ProductModule,
    ProvincesModule,
  ],
  providers: [AuthStrategy],
})
export class ApiModule {}
