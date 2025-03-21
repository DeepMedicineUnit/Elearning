import sql from '@/lib/db';

export const getRoles = async () => {
  const result = await sql.query(`SELECT * FROM roles ORDER BY id`);
  return result.recordset;
};

export const createRole = async (name) => {
  await sql.query(`INSERT INTO roles (name) VALUES (@name)`, { name });
};

export const getRoleById = async (id) => {
  const result = await sql.query(`SELECT * FROM roles WHERE id = @id`, { id });
  return result.recordset[0];
};

export const updateRole = async (id, name) => {
  await sql.query(`UPDATE roles SET name = @name WHERE id = @id`, { name, id });
};

export const deleteRole = async (id) => {
  await sql.query(`DELETE FROM roles WHERE id = @id`, { id });
};
