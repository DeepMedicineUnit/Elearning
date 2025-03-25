'use client';
import { Table, Button, Typography } from 'antd';

export default function UserTable({ roleId, data, loading, pagination, onChange, handleViewUser }) {
  // ✅ Định nghĩa cột bảng động theo role
  const columns = [
    { title: 'STT', dataIndex: 'stt', key: 'stt' },
    { title: 'Họ tên', dataIndex: 'full_name', key: 'full_name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    // ✅ Admin xem Khoa - Academic hoặc Lecturer xem Lớp
    roleId === 1
      ? { title: 'Khoa', dataIndex: 'department_name', key: 'department_name' }
      : { title: 'Lớp', dataIndex: 'class_name', key: 'class_name' },
    { title: 'Vai trò', dataIndex: 'role_name', key: 'role_name' },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewUser(record)}>
          Xem
        </Button>
      ),
    },
  ];

  // ✅ Lọc data ở FE dự phòng nếu BE chưa lọc kỹ
  const filteredData = roleId === 1 ? data : data.filter((user) => {
    if (roleId === 4) return user.role_name === 'Lecturer' || user.role_name === 'Student';
    if (roleId === 2) return user.role_name === 'Academic Officer' || user.role_name === 'Student';
    return false;
  });
  
  if (!roleId) return <Typography.Text type="danger">Không xác định quyền!</Typography.Text>;

  return (
    <Table
      className="border border-gray-300 rounded"
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      loading={loading}
      pagination={pagination}
      onChange={onChange}
    />
  );
}
