import * as rolePermissionModel from '@/models/auth-management/rolePermissionModel';

export const setPermissionsForRole = async (role_id, permission_ids) => {
  if (!permission_ids || !Array.isArray(permission_ids) || permission_ids.length === 0) {
    throw new Error('Permission IDs array is required');
  }

  await rolePermissionModel.assignPermissionsToRole(role_id, permission_ids);
  return { message: 'Permissions assigned to role successfully' };
};

export const clearPermissionsForRole = async (role_id) => {
  await rolePermissionModel.removePermissionsFromRole(role_id);
  return { message: 'Permissions removed from role successfully' };
};
