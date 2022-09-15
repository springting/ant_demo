/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Modal, Form, Input, Icon, Row, Col, Divider, Select } from 'antd';
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

const auth = localStorage.getItem('antd-pro-authority').slice(2,-2);

const CreateForm = Form.create()(props => {
    const {
      modalVisible,
      form,
      hideModal,
      shops,
      brands,
      companies,
      dispatch,
      auth_list,
    } = props;
    const { getFieldDecorator } = form;
    const record = {};
  
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue);
        dispatch({
          type: 'usertable/update',
          payload: { ...fieldsValue }
        })
        hideModal();
      });
    };

  
    return (
      <Modal
        width={980}
        bodyStyle={{ padding: '32px 20px 38px' }}
        destroyOnClose
        title="新增管理员"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={hideModal}
      >  
        <Form.Item {...formItemLayout} label="手机号">
            {getFieldDecorator('mobile', {
                rules: [
                    {
                    required: true,
                    message: '请填写手机号',
                    },
                ],
            })(<Input />)}
        </Form.Item>          
        <DetailForm form={form} record={record} dispatch={dispatch} shops={shops} brands={brands} auth_list={auth_list} companies={companies}/>
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
      shops,
      brands,
      companies,
      auth_list,
    } = props;
    const { getFieldDecorator } = form;
  
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue)
        const { sid, user_token } = record;
        dispatch({
          type: 'usertable/update',
          payload: {sid, user_token, ...fieldsValue}
        });
        hideUpdateModal();
      });
    };

  
    return (
      <Modal
        width={980}
        bodyStyle={{ padding: '32px 20px 48px' }}
        destroyOnClose
        title="编辑管理员"
        visible={visible}
        onOk={okHandle}
        onCancel={hideUpdateModal}
      >
        <Form.Item {...formItemLayout} label="手机号">
            {record.mobile}
        </Form.Item> 
        <DetailForm form={form} record={record} dispatch={dispatch} shops={shops} brands={brands} auth_list={auth_list} companies={companies}/>
      </Modal>
    );
  });

const RenderForm = Form.create()(props => {
    const { form, dispatch, search_items } = props;
    const { getFieldDecorator } = form;
  
    const handleSearch = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // console.log(fieldsValue)
        dispatch({
          type: 'usertable/fetch',
          payload: { ...fieldsValue }
        })
      });
    };
  
  
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="手机号">
              {getFieldDecorator('mobile')(<Input/>)}
            </Form.Item>
          </Col>
          { ['developer', 'company'].includes(auth) && (
          <Col md={8} sm={24}>
            <Form.Item label="权限">
              {getFieldDecorator('value')(
                <Select showSearch showArrow allowClear style={{ width: '100%' }}
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {search_items.map(item => (
                    <Select.Option key={item.name} value={item.sid} label={item.name}>
                        {item.name}
                    </Select.Option>
                  ))}
                </Select>,
            )}
            </Form.Item>
          </Col>
          )}
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

function UserTable({ usertable, global, loading, dispatch }) {
  const { user_list, auth_list, search_items } = usertable;
  const { brands, shops, companies } = global;
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
          type: 'usertable/delete',
          payload: { delete: true, gu_sid: sid },
        });
      },
      onCancel() {},
    });
  }

  const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',        
      },
      {
        title: '权限类型',
        dataIndex: 'auth_name',
        sorter: (a, b) => a.auth_name.localeCompare(b.auth_name),
      },
      {
        title: '权限范围',
        dataIndex: 'group_name',
      },
      {
        title: '操作',
        width: 120,
        render: record => (
          auth !== 'admin' && ['developer', 'admin'].includes(record.auth) ?  '' :
          (<span>
            <a onClick={() => showUpdateModal(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => Delete(record)}>删除</a>
          </span>)
        ),
      },
  ];

  const onClick = () => {
    setModalVisible(true);
  }

  return (
    <Card>
        <div className={styles.tableList}>
            <div className={styles.tableListForm}>
                <RenderForm dispatch={dispatch} search_items={search_items}/>
            </div>
            <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={onClick}>新增管理员</Button>
            </div>        
            <Table
                columns={columns}
                dataSource={user_list}
                rowKey='sid'
                loading={loading.effects['brandstable/fetch']}
            />
        </div>
        <CreateForm
            dispatch={dispatch}
            modalVisible={modalVisible}
            hideModal={hideModal}
            brands={brands}
            shops={shops}
            companies={companies}
            auth_list={auth_list}
        />
        <UpdateForm
            record={editingdetail}
            dispatch={dispatch}
            visible={visible}
            hideUpdateModal={hideUpdateModal}  
            brands={brands}
            shops={shops}  
            companies={companies}
            auth_list={auth_list}  
        />
    </Card>
  );
}

export default connect(({ usertable, global, loading }) => ({
    usertable,
    global,
    loading,
}))(UserTable);
