import sql from '@/lib/db';

export const getPermissions = async () => {
  const result = await sql.query(`SELECT * FROM permissions ORDER BY id`);
  return result.recordset;
};

export const createPermission = async (data) => {
  await sql.query(`
    INSERT INTO permissions (name, description) 
    VALUES (@name, @description)
  `, data);
};

export const getPermissionById = async (id) => {
  const result = await sql.query(`SELECT * FROM permissions WHERE id = @id`, { id });
  return result.recordset[0];
};

export const updatePermission = async (id, data) => {
  await sql.query(`
    UPDATE permissions 
    SET name = @name, description = @description 
    WHERE id = @id
  `, { ...data, id });
};

export const deletePermission = async (id) => {
  await sql.query(`DELETE FROM permissions WHERE id = @id`, { id });
};
