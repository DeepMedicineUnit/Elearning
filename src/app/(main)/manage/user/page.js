'use client';
import { Typography, Table, Button, Dropdown, Checkbox, Input } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { useEffect, useState } from 'react';

export default function ManageUserPage() {
    const [users, setUsers] = useState([]);
    const [roleId, setRoleId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [filterRoles, setFilterRoles] = useState([]);
    const [filterPositions, setFilterPositions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

    const adminColumns = [
        { title: 'STT', dataIndex: 'stt', key: 'stt' },
        { title: 'Họ tên', dataIndex: 'full_name', key: 'full_name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Chức vụ', dataIndex: 'position', key: 'position' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        { title: 'Thao tác', key: 'action', render: () => <Button type="link">Xem</Button> },
    ];

    const academicColumns = [
        { title: 'STT', dataIndex: 'stt', key: 'stt' },
        { title: 'Họ tên', dataIndex: 'full_name', key: 'full_name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Lớp', dataIndex: 'class', key: 'class' },
        { title: 'Vai trò', dataIndex: 'role', key: 'role' },
        { title: 'Thao tác', key: 'action', render: () => <Button type="link">Xem</Button> },
    ];

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth-management/users?page=1&limit=50', {
                headers: { Authorization: `Bearer ${Cookies.get('token')}` },
            });
            const data = await res.json();
            const list = data?.map((item, index) => ({
                ...item,
                key: item.id,
                stt: index + 1,
                role: item.role_name,
                class: item.class_name || 'Y đa khoa',
            }));
            setUsers(list);
        } catch (err) {
            console.error('Fetch user error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const decoded = jwt.decode(token);
            setRoleId(decoded?.role_id);
            fetchUsers();
        } else {
            console.warn('❌ Không tìm thấy token');
        }
    }, []);

    // ✅ Render filter theo role
    const renderFilterContent = () => {
        return (
            <>
                <div>
                    <Typography.Text strong>Vai trò:</Typography.Text>
                    <Checkbox.Group
                        className="flex flex-col gap-2 mb-4"
                        value={filterRoles}
                        onChange={setFilterRoles}
                    >
                        <div><Checkbox value="Admin">Admin</Checkbox></div>
                        <div><Checkbox value="Academic Officer">Academic Officer</Checkbox></div>
                    </Checkbox.Group>
                </div>
                <div>
                    {roleId === 1 && (
                        <>
                            <Typography.Text strong>Chức vụ:</Typography.Text>
                            <Checkbox.Group
                                className="flex flex-col gap-2"
                                value={filterPositions}
                                onChange={setFilterPositions}
                            >
                                <div><Checkbox value="thuong(normal)">Normal</Checkbox></div>
                                <div><Checkbox value="truong(provost)">Provost</Checkbox></div>
                                <div><Checkbox value="pho(vice)">Vice</Checkbox></div>
                            </Checkbox.Group>
                        </>
                    )}
                </div>
            </>
        );
    };

    const filterMenu = (
        <div className="p-4 w-64 bg-white rounded shadow border border-gray-200">
            {renderFilterContent()}
            <Button
                className="mt-4"
                block
                danger
                onClick={() => {
                    setFilterRoles([]);
                    setFilterPositions([]);
                }}
            >
                Xoá bộ lọc
            </Button>
        </div>
    );

    const filteredUsers = users.filter(user => {
        const roleMatch = filterRoles.length ? filterRoles.includes(user.role) : true;
        const positionMatch = filterPositions.length ? filterPositions.includes(user.position) : true;
        const searchMatch = user.full_name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase());
        return roleMatch && positionMatch && searchMatch;
    });

    const handleTableChange = (paginationInfo) => {
        setPagination(paginationInfo);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <Typography.Title level={3} className="m-0">Quản lý users</Typography.Title>
                <Button type="primary">Thêm mới</Button>
            </div>
            <div className="w-full h-[2px] bg-gray-300 my-4 mt-5 mb-5"></div>

            {/* ✅ Filter - Search - Reload */}
            <div className="flex items-center justify-between mb-4">
                <Dropdown
                    dropdownRender={() => filterMenu}
                    trigger={['click']}
                    placement="bottomLeft"
                    arrow
                >
                    <Button icon={<FilterOutlined />} type="primary" className="!bg-blue-500 hover:!bg-blue-600"/>
                </Dropdown>

                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Nhập tên hoặc email..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Button icon={<ReloadOutlined />} onClick={fetchUsers} />
                </div>
            </div>

            {/* ✅ Render bảng theo role */}
            {roleId === 1 && (
                <Table
                    className="border border-gray-300 rounded"
                    columns={adminColumns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                />
            )}

            {(roleId === 4 || roleId === 2) && (
                <Table
                    className="border border-gray-300 rounded"
                    columns={academicColumns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                />
            )}

            {!roleId && <Typography.Text type="danger">Không xác định quyền!</Typography.Text>}
        </div>
    );
}
