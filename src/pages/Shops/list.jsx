/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Modal, Form, Input, Select, Icon, Row, Col, Divider, Tooltip, Upload } from 'antd';
import styles from './index.less';
import DetailForm from './DetailForm.js';
import cookie from 'react-cookies'
import { routerRedux } from 'dva/router';

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
      shop_list,
      dispatch,
      pics,
      companies,
      logs
    } = props;
    const { getFieldDecorator } = form;
    const record = [];
  
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue);
        console.log(logs)
        const new_logs = {new: 1, ...logs}
        dispatch({
          type: 'shopstable/update',
          payload: {...fieldsValue, pics, logs: new_logs}
        })
        hideModal();
      });
    };

  
    return (
      <Modal
        width={980}
        bodyStyle={{ padding: '32px 20px 38px' }}
        destroyOnClose
        title="新增门店"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={hideModal}
      >
          <DetailForm form={form} record={record} dispatch={dispatch} companies={companies}/>
      </Modal>
    );
  });

  const UpdateForm = Form.create()(props => {
    const {
      visible,
      form,
      hideUpdateModal,
      shop_list,
      record,
      dispatch,
      pics,
      changed,
      companies,
      logs
    } = props;
    const { getFieldDecorator } = form;

  
    const okHandle = () => {
      // console.log(pics)
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue)
        console.log(logs)
        const { sid } = record;
        dispatch({
          type: 'shopstable/update',
          payload: {shop_sid: sid, ...fieldsValue, changed, pics, logs}
        });
        hideUpdateModal();
      });
    };

  
    return (
      <Modal
        width={980}
        bodyStyle={{ padding: '32px 20px 48px' }}
        destroyOnClose
        title="编辑门店"
        visible={visible}
        onOk={okHandle}
        onCancel={hideUpdateModal}
      >
          <Fragment>
            <DetailForm form={form} record={record} dispatch={dispatch} companies={companies}/>
          </Fragment>
          
      </Modal>
    );
  });

const RenderForm = Form.create()(props => {
    const { form, shops, dispatch, } = props;
    const { getFieldDecorator } = form;
  
    const handleSearch = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // console.log(fieldsValue)
        const { shop_sid } = fieldsValue;
        dispatch({
          type: 'shopstable/fetch',
          payload: {shop_sid}
        })
      });
    };
  
  
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="门店名称">
              {getFieldDecorator('shop_sid')(
                <Select
                  showSearch
                  allowClear
                  style={{ width: '220px' }}
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {shops.map(item => (
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

function ShopTable({ shopstable, global, loading, dispatch }) {
  const { shop_list, pics, changed, logs } = shopstable;
  const { shops, companies } = global;
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
          type: 'shopstable/delete',
          payload: { shop: true, shop_sid: sid },
        });
      },
      onCancel() {},
    });
  }
  const Check = (record) => {
    const { sid } = record  ;
    cookie.save('change_sid',sid,{path:'/'})
    dispatch(
      routerRedux.push({
        pathname: '/shop/check',
      }),
    );
  }

  const columns = [
      {
        title: '门店名称',
        dataIndex: 'name',
      },
      {
        title: '省市区',
        dataIndex: 'region',
      },
      {
        title: '商业面积',
        dataIndex: 'area',
        sorter: (a, b) => a.area.slice(0,-4) - b.area.slice(0,-4),
      },
      {
        title: '运营商',
        dataIndex: 'operator',
      },
      {
        title: '开业时间',
        dataIndex: 'opening_time',
        sorter: (a, b) => a.opening_time.localeCompare(b.opening_time),
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: record => {
          if (record === 'created') {
            return (<div style={{color: 'red'}}>待审核</div>);
          } else if (record === 'checked') {
            return '已审核';
          } else {
            return '审核未通过';
          }
        },
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      {
        title: '操作',
        width: 150,
        render: record => {
          if (['developer', 'admin'].includes(auth)){
            return (
              <span>
                <a onClick={() => showUpdateModal(record)}>编辑</a>
                <Divider type="vertical" />
                <a onClick={() => Check(record)}>审核</a>
                <Divider type="vertical" />
                <a onClick={() => Delete(record)}>删除</a>
              </span>
            )
          } else {
            return <a onClick={() => showUpdateModal(record)}>编辑</a>
          }
        }       
      },
  ];

  return (
    <Card>
        <div className={styles.tableList}>
            <div className={styles.tableListForm}>
                <RenderForm shops={shops} dispatch={dispatch}/>
            </div>
            <div className={styles.tableListOperator} style={{'display': ['developer', 'company', 'admin'].includes(auth) ? '' : 'none'}}>
                <Button icon="plus" type="primary" onClick={() => setModalVisible(true)}>新增门店</Button>
            </div>        
            <Table
                columns={columns}
                dataSource={shop_list}
                rowKey='sid'
                loading={loading.effects['shopstable/fetch']}
            />
        </div>
        <CreateForm
            dispatch={dispatch}
            modalVisible={modalVisible}
            hideModal={hideModal} 
            pics={pics} 
            logs={logs}
            companies={companies}         
        />
        <UpdateForm
            record={editingdetail}
            dispatch={dispatch}
            visible={visible}
            hideUpdateModal={hideUpdateModal} 
            pics={pics} 
            logs={logs}
            changed={changed}
            companies={companies}      
        />
    </Card>
  );
}

export default connect(({ shopstable, global, loading }) => ({
    shopstable,
    global,
    loading,
}))(ShopTable);
