import * as userModel from '@/models/auth-management/userModel.js';
import { sendMail } from '@/lib/mailer';

export const listUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return await userModel.getUsers(offset, limit);
};

export const listUserByRole = async (roleId, departmentId) => {
  return await userModel.getUsersByRole(roleId, departmentId);
};

export const registerUser = async (data) => {
  // TODO: validate email format, password strength
  await userModel.createUser(data);
  await sendMail({
    to: data.email,
    subject: 'Thông tin tài khoản Elearning PTCU',
    text: `Xin chào ${data.full_name},

    Tài khoản của bạn đã được tạo trên hệ thống Elearning.

    Email: ${data.email}
    Mật khẩu: ${data.password}

    Bạn có thể đăng nhập tại: http://localhost:3000/login

    Trân trọng!`,
  });
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

