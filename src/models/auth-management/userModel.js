import sql from '@/lib/db';

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
  await sql.query(`
    INSERT INTO users (full_name, email, password, role_id, position, department_id, avatar_url)
    VALUES (@full_name, @email, @password, @role_id, @position, @department_id, @avatar_url)
  `, data);
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
      updated_at = GETDATE()
    WHERE id = @id
  `, { ...data, id });
};

// Xóa user
export const deleteUser = async (id) => {
  await sql.query(`DELETE FROM users WHERE id = @id`, { id });
};
