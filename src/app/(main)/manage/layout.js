'use client';

import { Layout } from 'antd';
import ManageSidebar from '@/components/ManageSidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@ant-design/v5-patch-for-react-19';

const { Sider, Content } = Layout;

export default function ManageLayout({ children }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ✅ Sidebar Quản lý */}
      <Sider width={250} className="bg-white shadow">
        <ManageSidebar />
      </Sider>

      {/* ✅ Nội dung + Toast */}
      <Layout>
        <Content className="p-6 bg-gray-50 min-h-screen">
          {/* ✅ Toast cho toàn bộ /manage */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
