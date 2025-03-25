import * as departmentModel from '@/models/department-class-course/departmentModel';

export const listDepartments = async () => {
  const departments = await departmentModel.getAllDepartments();
  return departments;
};
