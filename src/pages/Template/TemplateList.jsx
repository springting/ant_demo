/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Card, Form, Select, Row, Col, Table, Modal, Input } from 'antd';
import styles from './index.less';

const RenderForm = Form.create()(props => {
  const { form, supply_list, brand_list, dispatch, setEditingdatail, showModal } = props;
  const { getFieldDecorator } = form;
  const handleFormReset = () => {
    form.validateFields(err => {
      if (err) return;
      form.resetFields();
    });
  };
  const handleInsert = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { supply_sid, brand_token } = fieldsValue;
      const sbs = { supply_sid, brand_token };
      dispatch(
        routerRedux.push({
          pathname: '/setting/template/edit',
          state: { sbs },
        }),
      );
    });
  };

  const handleSearch = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { supply_sid, brand_token } = fieldsValue;
      dispatch({
        type: 'templatetable/fetchTemplate',
        payload: { supply_sid, brand_token },
      });
    });
  };

  const handleCopy = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      setEditingdatail(fieldsValue);
      if (fieldsValue.supply_sid && fieldsValue.brand_token) {
        showModal();
      }
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
        <Col md={8} sm={24}>
          <Form.Item label="供应商名称">
            {getFieldDecorator('supply_sid', {
              rules: [
                {
                  required: true,
                  message: '请选择供应商',
                },
              ],
            })(
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                onChange={supply_sid => {
                  dispatch({
                    type: 'global/fetchBrands',
                    payload: { supply_sid },
                  });
                }}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {supply_list.map(item => (
                  <Select.Option key={item.sup_info} value={item.sid} label={item.sup_info}>
                    {item.sup_info}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={6} sm={18}>
          <Form.Item label="品牌">
            {getFieldDecorator('brand_token', {
              rules: [
                {
                  required: true,
                  message: '请选择品牌',
                },
              ],
            })(
              <Select
                allowClear
                showArrow
                style={{ width: '100%' }}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {brand_list.map(item => (
                  <Select.Option key={item.sid} value={item.sid} label={item.brand_name}>
                    {item.brand_name}
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
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleInsert}>
              新增模板
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCopy}>
              同步模板
            </Button>
            <a
              href="https://www.bilibili.com/video/BV1Fp4y1a78C?from=search&seid=15984049846098478324"
              target="_blank"
              style={{ marginLeft: 8, color: 'red' }}
            >
              教学视频
            </a>
          </span>
        </Col>
      </Row>
    </Form>
  );
});

const CreateForm = Form.create()(props => {
  const { form, hideModal, visible, record, dispatch } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { supply_title } = fieldsValue;
      const { supply_sid, brand_token } = record;
      dispatch({
        type: 'templatetable/copyTemplate',
        payload: { supply_sid, brand_token, supply_title },
      });
      hideModal();
    });
  };
  return (
    <Modal
      width={500}
      bodyStyle={{ padding: '12px 20px 48px' }}
      destroyOnClose
      title="同步模板"
      visible={visible}
      onOk={okHandle}
      onCancel={hideModal}
      record={record}
    >
      <Form layout="inline">
        <Form.Item label="同步供应商编码">
          {getFieldDecorator('supply_title')(
            <Input placeholder="请填写要同步的供应商编码" style={{ width: '300px' }} />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
});

function TemplateList({ templatetable, loading, dispatch, global }) {
  const { templates } = templatetable;
  const { supply_list, brands } = global;
  const [visible, setVisible] = useState(false);
  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);
  const [editingdatail, setEditingdatail] = useState({});

  const onUpdate = record => {
    dispatch({
      type: 'templatetable/fetchTempdetail',
      payload: {
        type: 'supply_template',
        supply_sid: record.supply_sid,
        brand_token: record.brand_token,
      },
    });
  };

  const columns = [
    {
      title: '门店编码',
      dataIndex: 'shop_sid',
    },
    {
      title: '供应商编码',
      dataIndex: 'title',
    },
    {
      title: '供应商名称',
      dataIndex: 'supply_name',
    },
    {
      title: '品牌',
      dataIndex: 'brand_name',
      sorter: (a, b) => a.brand_name.localeCompare(b.brand_name),
    },
    {
      title: '操作',
      render: record => <a onClick={() => onUpdate(record)}>编辑</a>,
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <RenderForm
            supply_list={supply_list}
            brand_list={brands}
            dispatch={dispatch}
            setEditingdatail={setEditingdatail}
            showModal={showModal}
          />
        </div>
        <Table
          columns={columns}
          dataSource={templates}
          loading={loading.effects['templatetable/fetchTemplate']}
        />
      </div>
      <CreateForm
        visible={visible}
        hideModal={hideModal}
        record={editingdatail}
        dispatch={dispatch}
      />
    </Card>
  );
}

export default connect(({ templatetable, loading, dispatch, global }) => ({
  templatetable,
  loading,
  dispatch,
  global,
}))(TemplateList);
