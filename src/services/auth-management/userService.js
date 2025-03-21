import * as userModel from '@/models/auth-management/userModel.js';

export const listUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return await userModel.getUsers(offset, limit);
};

export const registerUser = async (data) => {
  // TODO: validate email format, password strength
  await userModel.createUser(data);
  return { message: 'User created successfully' };
};

export const getUserDetail = async (id) => {
  const user = await userModel.getUserById(id);
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUserInfo = async (id, data) => {
  await userModel.updateUser(id, data);
  return { message: 'User updated successfully' };
};

export const removeUser = async (id) => {
  await userModel.deleteUser(id);
  return { message: 'User deleted successfully' };
};
