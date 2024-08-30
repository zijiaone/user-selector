import Mock from 'mockjs';

Mock.setup({
  timeout: '300'
});

const userList = [];
for (var i = 0;i < 100; i++) {
  userList.push(Mock.mock({
    "UserName": Mock.Random.name(),
    "UserAge|20-50": 1
  }));
}

Mock.mock(/\/getUser/, 'get', {
  'Response|1': [
    {
      Data: userList,
    },
    {
      Error: {
        Code: '404',
        Message: 'User not found',
      },
    },
  ],
});