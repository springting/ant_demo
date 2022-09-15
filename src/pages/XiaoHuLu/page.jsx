/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'dva';
import { Table, Button, Card, } from 'antd';
import cookie from 'react-cookies';
import { routerRedux } from 'dva/router';


function Pages({ xiaohulu, dispatch }) {
  const { pages } = xiaohulu;

  const edit = record => {
    const { id } = record;
    cookie.save('default_pageId', id);
    dispatch({ type: 'xiaohulu/clear' });
    dispatch(
      routerRedux.push({
        pathname: '/xiaohulu/pageDetail',
      }),
    );
  };

  const onClick = () => {
    cookie.remove('default_pageId');
    dispatch({ type: 'xiaohulu/clear' });
    dispatch(
      routerRedux.push({
        pathname: '/xiaohulu/pageDetail',
      }),
    );
  };

  const columns = [
    {
      title: '页面',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '操作',
      width: 120,
      render: record => <a onClick={() => edit(record)}>编辑</a>,
    },
  ];

  return (
    <Card>
      <Button icon="plus" type="primary" onClick={onClick}>
        添加页面配置
      </Button>
      <Table columns={columns} dataSource={pages} rowKey="id" />
    </Card>
  );
}

export default connect(({ xiaohulu }) => ({ xiaohulu }))(Pages);
