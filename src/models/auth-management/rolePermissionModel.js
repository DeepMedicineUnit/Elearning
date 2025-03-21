import sql from '@/lib/db';

export const assignPermissionsToRole = async (role_id, permission_ids) => {
  // Xóa hết permission cũ trước (nếu cần clear old)
  await sql.query(`DELETE FROM role_permissions WHERE role_id = @role_id`, { role_id });

  // Thêm mới từng permission
  for (const permission_id of permission_ids) {
    await sql.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (@role_id, @permission_id)
    `, { role_id, permission_id });
  }
};

export const removePermissionsFromRole = async (role_id) => {
  await sql.query(`DELETE FROM role_permissions WHERE role_id = @role_id`, { role_id });
};
