'use client';
import { Typography } from 'antd';
import '@ant-design/v5-patch-for-react-19';

export default function ManageDepartmentPage() {
  return (
    <div>
      <Typography.Title level={3}>Quản lý khoa</Typography.Title>
      {/* Có thể render luôn dashboard chart, stats ở đây */}
    </div>
  );
}
