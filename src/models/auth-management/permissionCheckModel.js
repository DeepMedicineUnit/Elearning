import sql from '@/lib/db';

// ✅ Kiểm tra user có permission qua role hoặc admin_permissions
export const checkUserPermission = async (user_id, permission_name) => {
  const result = await sql.query(`
    SELECT 1 FROM users u
    JOIN roles r ON u.role_id = r.id
    JOIN role_permissions rp ON r.id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE u.id = @user_id AND p.name = @permission_name

    UNION

    SELECT 1 FROM admin_permissions ap
    JOIN permissions p ON ap.permission_id = p.id
    WHERE ap.admin_id = @user_id AND p.name = @permission_name
  `, { user_id, permission_name });

  return result.recordset.length > 0;
};
