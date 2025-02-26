import { SetMetadata } from '@nestjs/common';
import dataJson from '../../permissions.json';
import { PermissionType } from 'src/commons';
export const permissions = dataJson;

export const ROLES_KEY = 'roles';
export const Roles = (...roles: PermissionType[]) =>
  SetMetadata(ROLES_KEY, roles);
