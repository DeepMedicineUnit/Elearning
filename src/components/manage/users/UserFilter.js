'use client';
import { Button, Checkbox, Dropdown, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

export default function UserFilter({
  filterRoles,
  setFilterRoles,
  filterPositions,
  setFilterPositions,
  filterClasses,
  setFilterClasses,
  roleId,
  resetFilters,
  classList = [],
}) {
  const renderFilterContent = () => (
    <>
      <div>
        <Typography.Text strong>Vai trò:</Typography.Text>
        <Checkbox.Group
          className="flex flex-col gap-2 mb-4"
          value={filterRoles}
          onChange={setFilterRoles}
        >
          {roleId !== 1 && <Checkbox value="Admin">Admin</Checkbox>}
          {roleId !== 2 && roleId !== 4 && <Checkbox value="Student">Student</Checkbox>}
          <Checkbox value="Academic Officer">Academic Officer</Checkbox>
          <Checkbox value="Lecturer">Lecturer</Checkbox>
        </Checkbox.Group>
      </div>

      {roleId === 1 && (
        <div>
          <Typography.Text strong>Chức vụ:</Typography.Text>
          <Checkbox.Group
            className="flex flex-col gap-2"
            value={filterPositions}
            onChange={setFilterPositions}
          >
            <Checkbox value="normal">Normal</Checkbox>
            <Checkbox value="provost">Provost</Checkbox>
            <Checkbox value="vice">Vice</Checkbox>
          </Checkbox.Group>
        </div>
      )}

      {(roleId === 2 || roleId === 4) && (
        <div>
          <Typography.Text strong>Lọc theo lớp:</Typography.Text>
          <Checkbox.Group
            className="flex flex-col gap-2"
            value={filterClasses}
            onChange={setFilterClasses}
          >
            {classList.map((cls) => (
              <Checkbox key={cls.id} value={cls.id}>{cls.name}</Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      )}
    </>
  );

  const filterMenu = (
    <div className="p-4 w-64 bg-white rounded shadow border border-gray-200">
      {renderFilterContent()}
      <Button className="mt-4" block danger onClick={resetFilters}>Xoá bộ lọc</Button>
    </div>
  );

  return (
    <Dropdown dropdownRender={() => filterMenu} trigger={['click']} placement="bottomLeft" arrow>
      <Button icon={<FilterOutlined />} type="primary" className="!bg-blue-500 hover:!bg-blue-600"/>
    </Dropdown>
  );
}
