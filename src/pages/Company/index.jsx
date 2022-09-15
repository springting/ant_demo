/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Modal, Form, Input, Select, Icon, Row, Col, Divider, Tag } from 'antd';
import styles from './index.less';

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

const auth = localStorage.getItem('antd-pro-authority').slice(2,-2);

const CreateForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      hideModal,
      dispatch,
    } = props;
    const { getFieldDecorator } = form;
  
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue);
        dispatch({
          type: 'companytable/update',
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
        title="新增集团"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={hideModal}
      >  
        <Form.Item {...formItemLayout} label="集团名">
            {getFieldDecorator('name', {
                rules: [
                    {
                    required: true,
                    message: '请填写集团名',
                    },
                ],
            })(<Input />)}
        </Form.Item>
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
    } = props;
    const { getFieldDecorator } = form;
  
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue)
        const { sid } = record;
        dispatch({
          type: 'companytable/update',
          payload: {sid, ...fieldsValue}
        });
        hideUpdateModal();
      });
    };

  
    return (
      <Modal
        width={980}
        bodyStyle={{ padding: '32px 20px 48px' }}
        destroyOnClose
        title="编辑集团"
        visible={visible}
        onOk={okHandle}
        onCancel={hideUpdateModal}
      >
        <Form.Item {...formItemLayout} label="ID">{record.sid}</Form.Item>
        <Form.Item {...formItemLayout} label="集团名">
            {getFieldDecorator('name', {
                initialValue: record.name,
                rules: [
                    {
                    required: true,
                    message: '请填写集团名',
                    },
                ],
            })(<Input />)}
        </Form.Item>
      </Modal>
    );
  });

const RenderForm = Form.create()(props => {
    const { form, dispatch, companies } = props;
    const { getFieldDecorator } = form;
  
    const handleSearch = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // console.log(fieldsValue)
        const { company_sid } = fieldsValue;
        dispatch({
          type: 'global/fetchCompanies',
          payload: { company_sid }
        })
      });
    };
  
  
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <Form.Item label="集团">
              {getFieldDecorator('company_sid', {
                rules: [
                    {
                    required: true,
                    message: '请选择集团',
                    },
                ],
             })(
                <Select
                  showSearch
                  allowClear
                  style={{ width: '100%' }}
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {companies.map(item => (
                    <Select.Option key={item.name} value={item.sid} label={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" onClick={handleSearch}>
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  });

function CompanyTable({ companytable, global, loading, dispatch }) {
  const { companies } = global;
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
    const { sid } = record  ;
    confirm({
      title: '确定删除？',
      content: "删除后将无法恢复",
      onOk() {
        dispatch({
          type: 'companytable/delete',
          payload: { company: true, company_sid: sid },
        });
      },
      onCancel() {},
    });
  }

  const columns = [
      {
        title: 'ID',
        dataIndex: 'sid',
      },
      {
        title: '集团',
        dataIndex: 'name',
      },
      {
        title: '门店数量',
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
  };

  return (
    <Card>
        <div className={styles.tableList}>
            <div className={styles.tableListForm}>
                <RenderForm dispatch={dispatch} companies={companies}/>
            </div>
            <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={onClick}>新增集团</Button>
            </div>        
            <Table
                columns={columns}
                dataSource={companies}
                rowKey='sid'
                loading={loading.effects['companytable/fetch']}
            />
        </div>
        <CreateForm
            dispatch={dispatch}
            modalVisible={modalVisible}
            hideModal={hideModal}
        />
        <UpdateForm
            record={editingdetail}
            dispatch={dispatch}
            visible={visible}
            hideUpdateModal={hideUpdateModal}  
        />
    </Card>
  );
}

export default connect(({ companytable, global, loading }) => ({
    companytable,
    global,
    loading,
}))(CompanyTable);
