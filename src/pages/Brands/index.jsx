/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Modal, Form, Input, Select, Icon, Row, Col, Divider, Tag } from 'antd';
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
          type: 'brandstable/update',
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
        title="新增品牌"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={hideModal}
      >           
        <DetailForm form={form} record={record} dispatch={dispatch} category_list={category_list}/>
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
        const { sid } = record;
        dispatch({
          type: 'brandstable/update',
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
        title="编辑品牌"
        visible={visible}
        onOk={okHandle}
        onCancel={hideUpdateModal}
      >
        <DetailForm form={form} record={record} dispatch={dispatch} category_list={category_list}/>
      </Modal>
    );
  });

const RenderForm = Form.create()(props => {
    const { form, dispatch, brands } = props;
    const { getFieldDecorator } = form;
  
    const handleSearch = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // console.log(fieldsValue)
        const { brand_sid } = fieldsValue;
        dispatch({
          type: 'brandstable/fetch',
          payload: { brand_sid }
        })
      });
    };
  
  
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <Form.Item label="品牌">
              {getFieldDecorator('brand_sid', {
                rules: [
                    {
                    required: true,
                    message: '请选择品牌',
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
                  {brands.map(item => (
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

function BrandTable({ brandstable, global, loading, dispatch }) {
  const { brand_list } = brandstable;
  const { brands, category_list } = global;
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
          type: 'brandstable/delete',
          payload: { brand: true, brand_sid: sid },
        });
      },
      onCancel() {},
    });
  }

  const columns = [
      {
        title: '品牌',
        dataIndex: 'name',
      },
      {
        title: '品类',
        dataIndex: 'category_name',
        render: category_name => (
            <span>
              {category_name.map(item => (
                <Tag color="blue" key={item}>
                  {item}
                </Tag>
              ))}
            </span>
          ),
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
          ( ['developer', 'admin'].includes(auth) ?
          <span>
            <a onClick={() => showUpdateModal(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => Delete(record)}>删除</a>
          </span> :
          <a onClick={() => showUpdateModal(record)}>编辑</a>
          )
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
                <RenderForm dispatch={dispatch} brands={brands}/>
            </div>
            <div className={styles.tableListOperator} style={{'display': ['developer', 'admin'].includes(auth) ? '' : 'none'}}>
                <Button icon="plus" type="primary" onClick={onClick}>新增品牌</Button>
            </div>        
            <Table
                columns={columns}
                dataSource={brand_list}
                rowKey='sid'
                loading={loading.effects['brandstable/fetch']}
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

export default connect(({ brandstable, global, loading }) => ({
    brandstable,
    global,
    loading,
}))(BrandTable);
