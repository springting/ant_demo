/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Divider } from 'antd';
import cookie from 'react-cookies';
import { routerRedux } from 'dva/router';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 14 },
  },
};

function Charts({ xiaohulu, dispatch }) {
  const { charts } = xiaohulu;

  const edit = record => {
    const { id } = record;
    cookie.save('default_chartId', id);
    dispatch({ type: 'xiaohulu/clear' });
    dispatch(
      routerRedux.push({
        pathname: '/xiaohulu/chartDetail',
      }),
    );
  };

  const toAdd = () => {
    cookie.remove('default_chartId');
    dispatch({ type: 'xiaohulu/clear' });
    dispatch(
      routerRedux.push({
        pathname: '/xiaohulu/chartDetail',
      }),
    );
  };

  const columns = [
    {
      title: '表名',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '操作',
      width: 120,
      render: record => <a onClick={() => edit(record)}>编辑</a>,
    },
  ];

  return (
    <Card>
      <Button icon="plus" type="primary" onClick={toAdd}>
        添加图表配置
      </Button>
      <Table columns={columns} dataSource={charts} rowKey="id" />
    </Card>
  );
}

export default connect(({ xiaohulu }) => ({ xiaohulu }))(Charts);
