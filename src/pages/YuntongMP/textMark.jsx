/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import { Table, Button, Card } from 'antd';
import styles from '../WareHouse/style.less';

function TextMark({ configtable, dispatch, loading }) {
  const { product, texts } = configtable;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const submitButton = () => {
    const marks = Object.values(selectedRows).map(v => v.sid);
    setSelectedRowKeys([]);
    setSelectedRows([]);
    dispatch({
      type: 'configtable/confirmText',
      payload: { marks, type: 'insert_mark', product },
    });
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: '文字详情',
      dataIndex: 'text',
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <p>{product.title}</p>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={texts}
          pagination={false}
          loading={loading.effects['configtable/fetchtext']}
        />
        <div style={{ paddingTop: '30px' }}>
          <Button type="primary" onClick={submitButton}>
            确认
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default connect(({ configtable, loading }) => ({
  configtable,
  loading,
}))(TextMark);
