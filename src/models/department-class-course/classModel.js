import sql from '@/lib/db';

// Lấy danh sách lớp
export const getClasses = async () => {
  const result = await sql.query(`
    SELECT c.*, d.name AS department_name
    FROM classes c
    JOIN departments d ON c.department_id = d.id
    ORDER BY c.id
  `);
  return result.recordset;
};

// Lấy chi tiết lớp theo ID
export const getClassById = async (id) => {
  const result = await sql.query(`SELECT * FROM classes WHERE id = @id`, { id });
  return result.recordset[0];
};

// Tạo lớp học mới
export const createClass = async (data) => {
  await sql.query(`
    INSERT INTO classes (name, department_id)
    VALUES (@name, @department_id)
  `, data);
};

// Cập nhật lớp học
export const updateClass = async (id, data) => {
  await sql.query(`
    UPDATE classes SET
      name = @name,
      department_id = @department_id
    WHERE id = @id
  `, { ...data, id });
};

// Xoá lớp học
export const deleteClass = async (id) => {
  await sql.query(`DELETE FROM classes WHERE id = @id`, { id });
};
