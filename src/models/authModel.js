import sql from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export const createResetToken = async (user_id) => {
  const token = uuidv4();
  const expires_at = new Date(Date.now() + 1000 * 60 * 60); // 1h hết hạn

  await sql.query(`
    INSERT INTO password_resets (user_id, token, expires_at)
    VALUES (@user_id, @token, @expires_at)
  `, { user_id, token, expires_at });

  return token;
};

export const findResetToken = async (token) => {
  const result = await sql.query(`
    SELECT * FROM password_resets 
    WHERE token = @token AND expires_at > GETDATE()
  `, { token });
  return result.recordset[0];
};

export const resetPassword = async (user_id, new_password) => {
  await sql.query(`
    UPDATE users SET password = @new_password, updated_at = GETDATE()
    WHERE id = @user_id
  `, { user_id, new_password });
};

export const deleteResetToken = async (token) => {
  await sql.query(`DELETE FROM password_resets WHERE token = @token`, { token });
};

export const findUserByEmail = async (email) => {
    const result = await sql.query(`SELECT * FROM users WHERE email = @email`, { email });
    return result.recordset[0];
};

export const createUser = async (data) => {
    await sql.query(`
    INSERT INTO users (full_name, email, password, role_id, position, department_id, avatar_url)
    VALUES (@full_name, @email, @password, @role_id, @position, @department_id, @avatar_url)
  `, data);
};

export const getUserById = async (id) => {
    const result = await sql.query(`
      SELECT u.*, r.name AS role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = @id
    `, { id });
    return result.recordset[0];
};
