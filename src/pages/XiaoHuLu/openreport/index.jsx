/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Divider, Form, Modal } from 'antd';
import DetailForm from './detail';

const CreateForm = Form.create()(props => {
  const { modalVisible, form, hideModal, record, dispatch } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      console.log(fieldsValue);
      dispatch({
        type: 'xiaohulu/add',
        payload: { service: 'xiaohulu.repo_update', data: { ...fieldsValue } },
      });
      hideModal();
    });
  };
  return (
    <Modal
      width={950}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="openreport"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={hideModal}
    >
      <DetailForm form={form} record={record} />
    </Modal>
  );
});

function Openreports({ xiaohulu, dispatch }) {
  const { repos } = xiaohulu;
  const [modalVisible, setModalVisible] = useState(false);
  const [editingdetail, setEditingdatail] = useState([]);
  const hideModal = () => setModalVisible(false);

  const edit = record => {
    setEditingdatail(record);
    setModalVisible(true);
  };

  const toAdd = () => {
    setEditingdatail([]);
    setModalVisible(true);
  };

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'source',
      dataIndex: 'source',
      sorter: (a, b) => a.source.localeCompare(b.source),
    },
    {
      title: 'db',
      dataIndex: 'db',
      sorter: (a, b) => a.db.localeCompare(b.db),
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
        添加
      </Button>
      <Table columns={columns} dataSource={repos} rowKey="_id" pagination={false} />
      <CreateForm
        modalVisible={modalVisible}
        hideModal={hideModal}
        record={editingdetail}
        dispatch={dispatch}
      />
    </Card>
  );
}

export default connect(({ xiaohulu }) => ({ xiaohulu }))(Openreports);
