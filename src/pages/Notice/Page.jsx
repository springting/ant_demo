/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Modal, Form, Input, Select } from 'antd';
// import { reloadAuthorized } from '@/utils/Authorized';
// import { getAuthority, setAuthority } from '@/utils/authority';

const CreateForm = Form.create()(props => {
  const { modalVisible, form, hideModal, submitData, supply_list } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submitData(fieldsValue);
      hideModal();
    });
  };
  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="添加消息"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={hideModal}
    >
      <Form.Item>
        {getFieldDecorator('title', {
          rules: [
            {
              required: true,
              message: '请填写标题',
            },
          ],
        })(<Input placeholder="标题" />)}
      </Form.Item>
      <Form.Item style={{ display: 'inline-block', width: '90%', verticalAlign: 'baseline' }}>
        {getFieldDecorator('supply_sid_list', {
          rules: [
            {
              required: true,
              message: '请选择接收者',
            },
          ],
        })(
          <Select
            allowClear
            mode="multiple"
            placeholder="选择接收消息的供应商"
            style={{ width: '100%' }}
          >
            {supply_list.map(item => (
              <Select.Option key={item.sid} value={item.sid}>
                {item.supply_name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Button
        style={{ display: 'inline-block', verticalAlign: 'baseline' }}
        onClick={() => form.setFieldsValue({ supply_sid_list: supply_list.map(s => s.sid) })}
      >
        全选
      </Button>
      <Form.Item>
        {getFieldDecorator('content', {
          rules: [
            {
              required: true,
              message: '请输入消息正文',
            },
          ],
        })(<Input.TextArea placeholder="消息正文" />)}
      </Form.Item>
    </Modal>
  );
});

function NoticeTable({ noticetable, global, loading, dispatch }) {
  const { notices } = noticetable;
  const { supply_list } = global;
  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = () => setModalVisible(false);
  const submitData = params => dispatch({ type: 'noticetable/add', payload: params });
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '供应商',
      dataIndex: 'supply_sid',
      render: (text, record) =>
        (
          supply_list.filter(item => item.sid === record.supply_sid)[0] || {
            supply_name: record.supply_sid,
          }
        ).supply_name,
    },
    {
      title: '内容',
      dataIndex: 'description',
      render: text => text.slice(0, 16),
    },
    {
      title: '操作',
      render: (text, record) => (
        <a onClick={() => dispatch({ type: 'noticetable/delete', payload: record.key })}>
          删除消息
        </a>
      ),
    },
  ];
  return (
    <Card>
      <Button onClick={() => setModalVisible(true)}>发送通知</Button>
      <CreateForm
        modalVisible={modalVisible}
        hideModal={hideModal}
        submitData={submitData}
        supply_list={supply_list}
      />
      <Table
        columns={columns}
        expandedRowRender={record => <body style={{ margin: 0 }}>{record.description}</body>}
        dataSource={notices}
        loading={loading.effects['noticetable/fetch']}
      />
    </Card>
  );
}

export default connect(({ noticetable, global, loading }) => ({
  noticetable,
  global,
  loading,
}))(NoticeTable);
