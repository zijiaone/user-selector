import React, { useState } from 'react';
import { Select, Spin } from 'antd';
import axios from 'axios';
import debounce from 'lodash/debounce';
import './UserSelector.css'

const { Option } = Select;

interface User {
  UserName: string;
  UserAge: number;
}

interface UserSelectorProps {
  multiple?: boolean;
  maxCount?: number;
  onSelect: (user: User) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ multiple, maxCount, onSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  const fetchUsers = debounce(async (keyWord: string) => {
    setFetching(true);
    try {
      const response = await axios.get('https://mock.com/getUser', {
        params: { keyWord },
      });

      if (response.data.Response && response.data.Response.Data) {
        setUsers(response.data.Response.Data);
      } else {
        console.error(response.data.Response.Error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }, 800);

  return (
    <Select
      className='user-selector'
      showSearch
      placeholder="Select user"
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      popupMatchSelectWidth={300}
      mode={multiple ? 'multiple' : undefined}
      onSearch={fetchUsers}
      maxCount={maxCount}
      onSelect={(value: string) => {
        const selectedUser = users.find(user => user.UserName === value);
        if (selectedUser) {
          onSelect(selectedUser);
        }
      }}
    >
      {users.map(user => (
        <Option key={user.UserName} value={user.UserName}>
          {user.UserName} ({user.UserAge} years old)
        </Option>
      ))}
    </Select>
  );
};

export default UserSelector;