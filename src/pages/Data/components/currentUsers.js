import React, {useState } from 'react';
import { Table, } from 'antd';

const CurrentUsers = (props => {
  const { data, loading } = props;

  const columns = [
    {
      title: '用户',
      dataIndex: 'name',
    },
    {
      title: '访问时间',
      dataIndex: 'start_at',
    },
    {
      title: '访问时长（分钟）',
      width: 60,
      dataIndex: 'timedelta',     
    },
  ];
  
  return (
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        rowKey='index'
        pagination={false}
        scroll={{y: 450}}
        loading={loading.effects['datatable/fetch']}
      />
  )
});

export default CurrentUsers;
