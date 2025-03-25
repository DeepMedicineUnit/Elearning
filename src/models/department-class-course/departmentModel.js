import sql from '@/lib/db';

// Lấy tất cả departments
export const getAllDepartments = async () => {
  const result = await sql.query(`
    SELECT id, name, description
    FROM departments
    ORDER BY id
  `);
  return result.recordset;
};
