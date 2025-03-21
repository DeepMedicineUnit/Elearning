import * as roleModel from '@/models/auth-management/roleModel';

export const listRoles = async () => {
  return await roleModel.getRoles();
};

export const createNewRole = async (name) => {
  if (!name) throw new Error('Role name is required');
  await roleModel.createRole(name);
  return { message: 'Role created successfully' };
};

export const getRoleDetail = async (id) => {
  const role = await roleModel.getRoleById(id);
  if (!role) throw new Error('Role not found');
  return role;
};

export const updateRoleInfo = async (id, name) => {
  await roleModel.updateRole(id, name);
  return { message: 'Role updated successfully' };
};

export const removeRole = async (id) => {
  await roleModel.deleteRole(id);
  return { message: 'Role deleted successfully' };
};
