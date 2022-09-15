/* eslint-disable camelcase */
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Form, Select, Button } from 'antd';
import styles from '../../WareHouse/style.less';

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

const CreateForm = Form.create()(props => {
  const { form, modalVisible, hideModal, record, dispatch, source_list } = props;
  const { getFieldDecorator } = form;
  const onHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      // const names = [record.map((v) => v.name)]
      const names = Object.values(record).map(v => v.name);
      const { source } = fieldsValue;
      dispatch({
        type: 'sourcetable/update',
        payload: { names, source, type: 'update_source' },
      });
      hideModal();
    });
  };

  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="编辑"
      visible={modalVisible}
      onOk={onHandle}
      onCancel={hideModal}
    >
      <Fragment>
        <Form.Item {...formItemLayout} label={<span>渠道</span>}>
          {getFieldDecorator('source')(
            <Select showSearch style={{ width: '100%' }}>
              {source_list.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Fragment>
    </Modal>
  );
});

function Source({ sourcetable, dispatch, loading, global }) {
  const { sources } = sourcetable;
  const { source_list } = global;
  const [visible, setVisible] = useState(false);
  const hideModal = () => setVisible(false);
  const [editingdetail, setEditingdatail] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState(undefined);
  const [selectedRows, setSelectedRows] = useState(undefined);

  const showModal = record => {
    setEditingdatail([record]);
    setVisible(true);
  };

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setEditingdatail(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys,
    selectedRows,
    onChange: onSelectChange,
  };

  const handleSubmit = () => {
    setVisible(true);
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  const columns = [
    {
      title: '矿机',
      dataIndex: 'name',
    },
    {
      title: 'sign',
      dataIndex: 'sign',
    },
    {
      title: '近一分钟抓图数量',
      dataIndex: 'num',
    },
    {
      title: '渠道',
      dataIndex: 'source',
    },
    {
      title: '编辑',
      render: record => <a onClick={() => showModal(record)}>编辑</a>,
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <Table
          columns={columns}
          dataSource={sources}
          pagination={false}
          loading={loading.effects['sourcetable/fetch']}
          rowSelection={rowSelection}
        />
      </div>
      <div style={{ paddingTop: '30px' }}>
        <Button type="primary" onClick={handleSubmit}>
          确认
        </Button>
      </div>
      <CreateForm
        modalVisible={visible}
        hideModal={hideModal}
        record={editingdetail}
        dispatch={dispatch}
        source_list={source_list}
      />
    </Card>
  );
}

export default connect(({ sourcetable, loading, global }) => ({
  sourcetable,
  loading,
  global,
}))(Source);
