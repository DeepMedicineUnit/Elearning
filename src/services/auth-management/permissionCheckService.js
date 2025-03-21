import * as permissionCheckModel from '@/models/auth-management/permissionCheckModel';

export const checkPermission = async (user_id, permission_name) => {
  const hasPermission = await permissionCheckModel.checkUserPermission(user_id, permission_name);
  if (!hasPermission) throw new Error('Permission denied');
  return { hasPermission: true };
};
