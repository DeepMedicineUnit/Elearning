import * as permissionModel from '@/models/auth-management/permissionModel';

export const listPermissions = async () => {
  return await permissionModel.getPermissions();
};

export const createNewPermission = async (data) => {
  await permissionModel.createPermission(data);
  return { message: 'Permission created successfully' };
};

export const getPermissionDetail = async (id) => {
  const permission = await permissionModel.getPermissionById(id);
  if (!permission) throw new Error('Permission not found');
  return permission;
};

export const updatePermissionInfo = async (id, data) => {
  await permissionModel.updatePermission(id, data);
  return { message: 'Permission updated successfully' };
};

export const removePermission = async (id) => {
  await permissionModel.deletePermission(id);
  return { message: 'Permission deleted successfully' };
};
