import * as adminPermissionModel from '@/models/auth-management/adminPermissionModel';

export const setPermissionsForUser = async (admin_id, permission_ids, granted_by) => {
  if (!permission_ids || !Array.isArray(permission_ids) || permission_ids.length === 0) {
    throw new Error('Permission IDs array is required');
  }

  await adminPermissionModel.assignPermissionsToUser(admin_id, permission_ids, granted_by);
  return { message: 'Permissions assigned to user successfully' };
};

export const clearPermissionsForUser = async (admin_id) => {
  await adminPermissionModel.removePermissionsFromUser(admin_id);
  return { message: 'Permissions removed from user successfully' };
};
