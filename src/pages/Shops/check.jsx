/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card } from 'antd';
import styles from './index.less';
import { routerRedux } from 'dva/router';

function CheckTable({  shopstable, loading, dispatch }) {
    const { details, change_sid } = shopstable;
    const onOk = () => {
      dispatch({
        type: 'shopstable/check',
        payload: { check: true, shop_sid: change_sid },
      });
    };
    const onCancel = () => {
      dispatch({
        type: 'shopstable/check',
        payload: { check: false, shop_sid: change_sid },
      });
    };

    const onBack = () => {
      dispatch(
        routerRedux.push({
          pathname: '/shop/list',
        }),
      );
    };
  
    const columns = [
        {
          title: '属性',
          dataIndex: 'name',
        },
        {
          title: '修改前',
          render: record => {
            if (record.type === 'logo'){
              return (
                <img width={100} src={record.old} />
              )
                
            } else if (record.type === 'pics'){
              return (
                <div >
                  { record['old'].map(item => {
                    return (
                      <img style={{width: 100, margin: 10}} src={item} />
                    )
                  })}
                </div>
              )

            } else {
              return record.old
            }
          }
        },
        {
          title: '修改后',
          render: record => {
            if (record.type === 'logo'){
              return (
                <img width={100} src={record.new} />
              )
                
            } else if (record.type === 'pics'){
              return (
                <div >
                  { record['new'].map(item => {
                    return (
                      <img style={{width: 100, margin: 10}} src={item} />
                    )
                  })}
                </div>
              )

            } else {
              return record.new
            }
          }
        },

    ];
    
    return (
      <Card>
        <div className={styles.tableList}>
          <Table
              columns={columns}
              dataSource={details}
              rowKey='name'
              pagination={false}
          />
        </div>
        <Button style={{ margin: 20, float: 'right' }} onClick={onBack}>
          返回
        </Button>
        <Button type="primary" style={{ margin: 20, float: 'right' }} onClick={onOk}>
          审核通过
        </Button>
        <Button type="danger" style={{ margin: 20, float: 'right' }} onClick={onCancel}>
          审核未通过
        </Button>
      </Card>
    );
  }
  
  export default connect(({ shopstable, global, loading }) => ({
      shopstable,
      global,
      loading,
  }))(CheckTable);
  