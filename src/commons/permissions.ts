import dataJson from '../../permissions.json';
export const permissions = dataJson;
export const permissionsArray = Object.keys(permissions);
export type PermissionType = keyof typeof permissions;
