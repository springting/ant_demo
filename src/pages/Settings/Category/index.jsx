/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Modal, Form, Input,  Icon, Divider, Tag } from 'antd';
import styles from './index.less';
import DetailForm from './form';

const { confirm } = Modal;

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
    const {
      modalVisible,
      form,
      hideModal,
      category_list,
      dispatch,
    } = props;
    const { getFieldDecorator } = form;
    const record = {};
  
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue);
        dispatch({
          type: 'categorytable/update',
          payload: {...fieldsValue}
        })
        hideModal();
      });
    };

  
    return (
      <Modal
        width={980}
        bodyStyle={{ padding: '32px 20px 38px' }}
        destroyOnClose
        title="新增品类"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={hideModal}
      > 
        <Form.Item {...formItemLayout} label="品类Id">
            {getFieldDecorator('category_sid', {
                rules: [
                    {
                    required: true,
                    message: '请填写品类Id',
                    },
                ],
            })(<Input />)}
        </Form.Item>          
        <DetailForm form={form} record={record} dispatch={dispatch}/>
      </Modal>
    );
  });

  const UpdateForm = Form.create()(props => {
    const {
      visible,
      form,
      hideUpdateModal,
      record,
      dispatch,
      category_list
    } = props;
    const { getFieldDecorator } = form;
  
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue)
        const { category_sid } = record;
        dispatch({
          type: 'categorytable/update',
          payload: {category_sid, ...fieldsValue}
        });
        hideUpdateModal();
      });
    };

  
    return (
      <Modal
        width={980}
        bodyStyle={{ padding: '32px 20px 48px' }}
        destroyOnClose
        title="编辑品类"
        visible={visible}
        onOk={okHandle}
        onCancel={hideUpdateModal}
      >
        <Form.Item {...formItemLayout} label="品类Id">
            {record.category_sid}
        </Form.Item>
        <DetailForm form={form} record={record} dispatch={dispatch} category_list={category_list}/>
      </Modal>
    );
  });


function CategoryTable({ categorytable, global, loading, dispatch }) {
  const { category_list } = categorytable;
  const [modalVisible, setModalVisible] = useState(false);
  const [editingdetail, setEditingdatail] = useState([]);
  const hideModal = () => setModalVisible(false);
  const [visible, setVisible] = useState(false);
  const hideUpdateModal = () => setVisible(false);

  const showUpdateModal = (record) => {
    // console.log(record)
    setEditingdatail(record);
    setVisible(true);
  }

  const Delete = (record) => {
    const { category_sid } = record  ;
    confirm({
      title: '确定删除？',
      content: "删除后将无法恢复",
      onOk() {
        dispatch({
          type: 'categorytable/delete',
          payload: { category: true, category_sid: category_sid },
        });
      },
      onCancel() {},
    });
  }

  const columns = [
      {
        title: 'Id',
        dataIndex: 'category_sid',
      },
      {
        title: '品类',
        // dataIndex: 'name',
        render: record => (
            <span>
                <Tag color={record.tag_color} key={record.name}>
                  {record.name}
                </Tag>
            </span>
          ),
      },
      {
        title: '店铺数量',
        dataIndex: 'cnt',
        sorter: (a, b) => a.cnt - b.cnt,
      },
      {
        title: '操作',
        width: 120,
        render: record => (
          <span>
            <a onClick={() => showUpdateModal(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => Delete(record)}>删除</a>
          </span>
        ),
      },
  ];

  const onClick = () => {
    setModalVisible(true);
  }

  return (
    <Card>
        <h1>品类管理</h1>
        <p>集中展示和配置所有品类</p>
        <Divider />
        <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={onClick}>新增品类</Button>
            </div>        
            <Table
                columns={columns}
                dataSource={category_list}
                rowKey='sid'
                pagination={false}
                loading={loading.effects['categorytable/fetch']}
            />
        </div>
        <CreateForm
            dispatch={dispatch}
            modalVisible={modalVisible}
            hideModal={hideModal}
            category_list={category_list}
        />
        <UpdateForm
            record={editingdetail}
            dispatch={dispatch}
            visible={visible}
            hideUpdateModal={hideUpdateModal}  
            category_list={category_list}     
        />
    </Card>
  );
}

export default connect(({ categorytable, global, loading }) => ({
    categorytable,
    global,
    loading,
}))(CategoryTable);
