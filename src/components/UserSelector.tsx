import React, { useState } from 'react';
import { message, Select, Spin } from 'antd';
import axios, { Canceler } from 'axios';
import debounce from 'lodash/debounce';
import './UserSelector.css'

const { Option } = Select;

let canceler: Canceler;

export interface User {
  UserName: string;
  UserAge: number;
}

interface UserSelectorProps {
  multiple?: boolean;
  maxCount?: number;
  onSelect: (user: User | User[]) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ multiple, maxCount, onSelect }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const handleError = (err: string) => {
    messageApi.open({
      type: 'error',
      content: err,
    });
  };

  const fetchUsers = debounce(async (keyWord: string) => {
    canceler?.(); // 取消请求

    // 过滤空字符串或者一些特殊表情字符
    if (!keyWord.trim() || !/^[a-zA-Z0-9\s]+$/.test(keyWord)) return;

    setFetching(true);
    try {
      const response = await axios.get('https://mock.com/getUser', {
        params: { keyWord },
        timeout: 10000, // 设置超时时间为10秒
        cancelToken: new axios.CancelToken(cb => {
          canceler = cb;
        }),
      });
      
      const res = response.data.Response;
      if (res?.Data) {
        setUsers(res.Data);
      } else {
        handleError(res.Error?.Message);
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'ECONNABORTED') {
        handleError('Request timeout');
      } else {
        handleError('Failed to fetch');
      }
    } finally {
      setFetching(false);
    }
  }, 800);
  
  const handleSelectChange = (value: string) => {
    if (multiple) {
      const selectedUsers = users.filter(user => value.includes(user.UserName));
      onSelect(selectedUsers);
    } else {
      const selectedUser = users.find(user => user.UserName === value);
      if (selectedUser) {
        onSelect(selectedUser);
      }
    }
  }

  return (
    <>
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
        onSelect={handleSelectChange}
      >
        {users.map(user => (
          <Option key={user.UserName} value={user.UserName}>
            {user.UserName} ({user.UserAge} years old)
          </Option>
        ))}
      </Select>
      {contextHolder}
    </>
  );
};

export default UserSelector;