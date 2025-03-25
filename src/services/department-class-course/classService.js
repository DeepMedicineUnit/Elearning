import * as classModel from '@/models/department-class-course/classModel';

// Lấy danh sách lớp
export const listClasses = async () => {
  return await classModel.getClasses();
};

// Lấy chi tiết lớp
export const getClassDetail = async (id) => {
  const classItem = await classModel.getClassById(id);
  if (!classItem) throw new Error('Class not found');
  return classItem;
};

// Tạo lớp
export const createClass = async (data) => {
  await classModel.createClass(data);
  return { message: 'Class created successfully' };
};

// Cập nhật lớp
export const updateClass = async (id, data) => {
  await classModel.updateClass(id, data);
  return { message: 'Class updated successfully' };
};

// Xoá lớp
export const removeClass = async (id) => {
  await classModel.deleteClass(id);
  return { message: 'Class deleted successfully' };
};
