/*
https://docs.nestjs.com/guards#guards
*/

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from 'src/api/users/entities/user.entity';
import { PermissionType } from 'src/commons';
import { ROLES_KEY } from 'src/decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user as User;
    const roles = user.roles;
    const permissions = user.roles.flatMap((i) =>
      i.permissions.map((j) => j.name),
    );
    if (roles.map((i) => i.name).includes(User.SUPER_ADMIN)) {
      return true;
    }
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (
      requiredPermissions.some((permission) => permissions.includes(permission))
    ) {
      return true;
    }
    throw new ForbiddenException(`User does not have the right roles.`);
  }
}
