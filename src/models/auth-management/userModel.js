import sql from '@/lib/db';
import bcrypt from 'bcrypt'

// Lấy danh sách user có phân trang
export const getUsers = async (offset, limit) => {
  const result = await sql.query(`
        SELECT 
      u.id, 
      u.full_name, 
      u.email, 
      u.avatar_url, 
      u.position, 
      u.department_id, 
      u.created_at, 
      u.updated_at, 
      u.phone_number,
      u.gender,
      u.date_of_birth,
      r.name AS role_name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    ORDER BY u.id
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `, { offset, limit });
  return result.recordset;
};

// Tạo user
export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10)
  await sql.query(`
    INSERT INTO users (full_name, email, password, role_id, position, department_id, avatar_url, phone_number, gender, date_of_birth)
    VALUES (@full_name, @email, @password, @role_id, @position, @department_id, @avatar_url, @phone_number, @gender, @date_of_birth)
  `, {
    ...data,
    password: hashedPassword, // ✅ Lưu mật khẩu đã hash
  });
};

// Lấy user theo ID
export const getUserById = async (id) => {
  const result = await sql.query(`SELECT * FROM users WHERE id = @id`, { id });
  return result.recordset[0];
};

// Cập nhật user
export const updateUser = async (id, data) => {
  await sql.query(`
    UPDATE users SET
      full_name = @full_name,
      email = @email,
      role_id = @role_id,
      position = @position,
      department_id = @department_id,
      avatar_url = @avatar_url,
      updated_at = GETDATE(),
      phone_number = @phone_number,
      gender = @gender,
      date_of_birth = @date_of_birth
    WHERE id = @id
  `, { ...data, id });
};

// Xóa user
export const deleteUser = async (id) => {
  await sql.query(`DELETE FROM users WHERE id = @id`, { id });
};

//Get user theo role
export const getUsersByRole = async (roleId, departmentId) => {
  if (roleId === 1) {
    // ✅ Admin: Lấy Lecturer (2) và Academic Officer (4)
    const result = await sql.query(`
      SELECT u.id, u.full_name, u.email, u.avatar_url, u.position, u.department_id,
             u.created_at, u.updated_at, u.phone_number, u.gender, u.date_of_birth,
             r.name as role_name, d.name as department_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.role_id IN (1, 2, 4)
    `);
    return result.recordset;
  }

  if (roleId === 4) {
    // ✅ Academic Officer: Xem Lecturer (2) và Student (3) cùng department
    const result = await sql.query(`
      SELECT u.id, u.full_name, u.email, u.avatar_url, u.position, u.department_id,
             u.created_at, u.updated_at, u.phone_number, u.gender, u.date_of_birth,
             r.name as role_name, d.name as department_name, c.name as class_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN students_classes sc ON u.id = sc.student_id
      LEFT JOIN classes c ON sc.class_id = c.id
      WHERE (u.role_id = 2 AND u.department_id = @departmentId)
         OR (u.role_id = 3 AND c.department_id = @departmentId)
    `, { departmentId });
    return result.recordset;
  }

  if (roleId === 2) {
    // ✅ Lecturer: Xem Academic Officer (4) và Student (3) cùng department
    const result = await sql.query(`
      SELECT u.id, u.full_name, u.email, u.avatar_url, u.position, u.department_id,
             u.created_at, u.updated_at, u.phone_number, u.gender, u.date_of_birth,
             r.name as role_name, c.name as class_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN departments d ON u.department_id = d.id
      LEFT JOIN students_classes sc ON u.id = sc.student_id
      LEFT JOIN classes c ON sc.class_id = c.id
      WHERE (u.role_id = 4 AND u.department_id = @departmentId)
         OR (u.role_id = 3 AND c.department_id = @departmentId)
    `, { departmentId });
    return result.recordset;
  }

  // ❌ Student hoặc role không hợp lệ
  return [];
};

