import React, {useState } from 'react';
import { Table, } from 'antd';

const BrandsHot = (props => {
  const { data, loading } = props;

  const columns = [
    {
      title: '排名',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '品牌',
      align: 'center',
      dataIndex: 'name',
    },
    {
      title: '访客数',
      width: 50,
      dataIndex: 'cnt',
    },
  ];
  
  return (
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        rowKey='name'
        pagination={false}
        scroll={{y: 450}}
        loading={loading.effects['datatable/fetch']}
      />
  )
});

export default BrandsHot;
