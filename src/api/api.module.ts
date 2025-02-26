import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { BannersModule } from './banners/banners.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PermissionsModule,
    RolesModule,
    BannersModule,
    CategoriesModule,
  ],
})
export class ApiModule {}
