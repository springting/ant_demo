/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Modal, Form, Input, Select, Icon, Row, Col, Divider, Tooltip, Upload } from 'antd';
import styles from './index.less';
import LocationForm from './LocationForm';

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
      brands,
      shops,
      floors,
      dispatch,
    } = props;
    const { getFieldDecorator } = form;
    const record = {"floors": floors};
  
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        console.log(fieldsValue);
        dispatch({
          type: 'shopstable/updateLocation',
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
        title="新增店铺落位"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={hideModal}
      >
        <Fragment>
          <Form.Item {...formItemLayout} label="门店">
              {getFieldDecorator('shop_sid', {
              rules: [
                  {
                  required: true,
                  message: '请选择门店',
                  },
              ],
              })(
              <Select
                showSearch
                allowClear
                onChange={shop_sid => {
                dispatch({
                    type: 'shopstable/fetchFloor',
                    payload: { _shop_sid: shop_sid },
                });
                }}
                style={{ width: '100%' }}
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
          <Form.Item {...formItemLayout} label="品牌">
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
          <LocationForm form={form} record={record} dispatch={dispatch}/>
        </Fragment>
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
      // console.log(pics)
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue)
        const { sid, shop_sid, brand_sid } = record;
        dispatch({
          type: 'shopstable/updateLocation',
          payload: {sid,shop_sid, brand_sid, ...fieldsValue}
        });
        hideUpdateModal();
      });
    };

  
    return (
      <Modal
        width={980}
        bodyStyle={{ padding: '32px 20px 48px' }}
        destroyOnClose
        title="编辑店铺落位"
        visible={visible}
        onOk={okHandle}
        onCancel={hideUpdateModal}
      >
        <Fragment>
          <Form.Item {...formItemLayout} label="门店">
              {record.shop_name}
          </Form.Item>
          <Form.Item {...formItemLayout} label="品牌">
              {record.brand_name}
          </Form.Item>
          <LocationForm form={form} record={record} dispatch={dispatch}/>
        </Fragment>       
      </Modal>
    );
  });

const RenderForm = Form.create()(props => {
    const { form, shops, dispatch, brands } = props;
    const { getFieldDecorator } = form;
  
    const handleSearch = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        // console.log(fieldsValue)
        const { shop_sid, brand_sid } = fieldsValue;
        dispatch({
          type: 'shopstable/fetchShopBrands',
          payload: {shop_sid, brand_sid}
        })
      });
    };
  
  
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form.Item label="门店">
              {getFieldDecorator('shop_sid', {
                rules: [
                    {
                    required: true,
                    message: '请选择门店',
                    },
                ],
              })(
                <Select
                  showSearch
                  allowClear
                  onChange={shop_sid => {
                    dispatch({
                      type: 'global/fetchBrands',
                      payload: { shop_sid },
                    });
                  }}
                  style={{ width: '250px' }}
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
            <Form.Item label="品牌">
              {getFieldDecorator('brand_sid', {
                rules: [
                    {
                    required: true,
                    message: '请选择品牌或新增店铺落位',
                    },
                ],
             })(
                <Select
                  showSearch
                  allowClear
                  style={{ width: '200px' }}
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

function LocationTable({ shopstable, global, loading, dispatch }) {
  const { shop_brands, floors } = shopstable;
  const { shops, brands } = global;
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
          type: 'shopstable/deleteLocation',
          payload: { shop_brands: true, shop_brands_sid: sid },
        });
      },
      onCancel() {},
    });
  }

  const columns = [
      {
        title: '门店',
        dataIndex: 'shop_name',
      },
      {
        title: '品牌',
        dataIndex: 'brand_name',
      },
      {
        title: '楼层/区域',
        dataIndex: 'floor_no',
      },
      {
        title: '柜台',
        dataIndex: 'counter_no',
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
    dispatch({ type: 'shopstable/clear' });
  }

  return (
    <Card>
        <div className={styles.tableList}>
            <div className={styles.tableListForm}>
                <RenderForm shops={shops} dispatch={dispatch} brands={brands}/>
            </div>
            <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={onClick}>新增店铺落位</Button>
            </div>        
            <Table
                columns={columns}
                dataSource={shop_brands}
                rowKey='sid'
                loading={loading.effects['shopstable/fetchShopBrands']}
            />
        </div>
        <CreateForm
            dispatch={dispatch}
            modalVisible={modalVisible}
            hideModal={hideModal}
            shops={shops}
            brands={brands}
            floors={floors}         
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

export default connect(({ shopstable, global, loading }) => ({
    shopstable,
    global,
    loading,
}))(LocationTable);
