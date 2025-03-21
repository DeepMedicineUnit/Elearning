import sql from '@/lib/db';

// Gán quyền cho user
export const assignPermissionsToUser = async (admin_id, permission_ids, granted_by) => {
  // Xóa quyền cũ trước (nếu muốn reset)
  await sql.query(`DELETE FROM admin_permissions WHERE admin_id = @admin_id`, { admin_id });

  for (const permission_id of permission_ids) {
    await sql.query(`
      INSERT INTO admin_permissions (admin_id, permission_id, granted_by)
      VALUES (@admin_id, @permission_id, @granted_by)
    `, { admin_id, permission_id, granted_by });
  }
};

// Xóa hết quyền của user
export const removePermissionsFromUser = async (admin_id) => {
  await sql.query(`DELETE FROM admin_permissions WHERE admin_id = @admin_id`, { admin_id });
};
