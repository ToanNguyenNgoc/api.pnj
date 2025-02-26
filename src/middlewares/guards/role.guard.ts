/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionType } from 'src/commons';
import { ROLES_KEY } from 'src/decorators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<PermissionType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    console.log(requiredRoles);
    // !requiredRoles.some((role) => user.roles.includes(role))
    return true;
  }
}
