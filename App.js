import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout, Table, Spin, Typography, Space } from 'antd';
import { fetchTodos, fetchUsers } from './api';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const { data: todos, isLoading: todosLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (todosLoading || usersLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#001529', padding: '0 20px' }}>
          <Title style={{ color: '#fff', margin: 0 }} level={3}>
            User Task Statistics
          </Title>
        </Header>
        <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </Layout>
    );
  }

  const userTaskStats = users.map(user => {
    const userTodos = todos.filter(todo => todo.userId === user.id);
    const totalTasks = userTodos.length;
    const completedTasks = userTodos.filter(todo => todo.completed).length;
    const pendingTasks = totalTasks - completedTasks;

    return {
      key: user.id,
      name: user.name,
      totalTasks,
      completedTasks,
      pendingTasks,
      todos: userTodos,
    };
  });

  const columns = [
    {
      title: 'User Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Total Tasks',
      dataIndex: 'totalTasks',
      key: 'totalTasks',
    },
    {
      title: 'Completed Tasks',
      dataIndex: 'completedTasks',
      key: 'completedTasks',
    },
    {
      title: 'Pending Tasks',
      dataIndex: 'pendingTasks',
      key: 'pendingTasks',
    },
  ];

  const expandedRowRender = (record) => {
    const taskColumns = [
      {
        title: 'Task ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'Task Name',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: 'Completed',
        dataIndex: 'completed',
        key: 'completed',
        render: (completed) => (completed ? 'Yes' : 'No'),
      },
    ];

    return <Table columns={taskColumns} dataSource={record.todos} pagination={false} rowKey="id" />;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 20px' }}>
        <Title style={{ color: '#fff', margin: 0 }} level={3}>
          ToDo-List
        </Title>
      </Header>
      <Content style={{ padding: '50px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Table
            dataSource={userTaskStats}
            columns={columns}
            pagination={{ pageSize: 5 }}
            bordered
            expandable={{ expandedRowRender }}
            title={() => 'Task Summary'}
          />
        </Space>
      </Content>
    </Layout>
  );
};

export default App;