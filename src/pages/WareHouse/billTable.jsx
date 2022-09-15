/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Divider, Row, Col, Select, Button } from 'antd';
import styles from './style.less';

const RenderForm = Form.create()(props => {
  const { form, brand_list, dispatch } = props;
  const { getFieldDecorator } = form;

  const handleSearch = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { brand_token } = fieldsValue;
      dispatch({
        type: 'warehouse/fetchBills',
        payload: { brand_token },
      });
    });
  };

  const handleFormReset = () => {
    form.validateFields(err => {
      if (err) return;
      form.resetFields();
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
        <Col md={6} sm={18}>
          <Form.Item label="品牌">
            {getFieldDecorator('brand_token')(
              <Select
                allowClear
                showArrow
                showSearch
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
          </span>
        </Col>
      </Row>
    </Form>
  );
});

function BillsTable({ warehouse, dispatch, global }) {
  const { bills } = warehouse;
  const { brand_list } = global;
  const onclick = record => {
    dispatch({
      type: 'warehouse/fetchItems',
      payload: { bill_sid: record.sid, f: 'json' },
    });
  };
  const Delete = record => {
    dispatch({
      type: 'warehouse/deleteBills',
      payload: { bill_sid: record.sid },
    });
  };

  const columns = [
    {
      title: '订单时间',
      dataIndex: 'create_at',
    },
    {
      title: '供应商',
      dataIndex: 'title',
    },
    {
      title: '品牌',
      dataIndex: 'brand_name',
    },
    {
      title: '订单号',
      dataIndex: 'sid',
    },
    {
      title: '商品款数',
      dataIndex: 'skus',
    },
    {
      title: '总库存',
      dataIndex: 'cnt',
    },
    {
      title: '订单类型',
      render: record => (
        <a
          // href={'https://xzs.vongcloud.com/items?bill_sid=' + record.sid}
          // target="_blank"
          onClick={() => onclick(record)}
        >
          {record.action === 'insert' ? '入库单' : '校对单'}
        </a>
      ),
    },
    {
      title: '操作',
      render: record => (
        <span>
          <a onClick={() => Delete(record)}>删除</a>
        </span>
      ),
    },
  ];

  return (
    <Card>
      <div className={styles.tableListForm}>
        <RenderForm brand_list={brand_list} dispatch={dispatch} />
      </div>
      <Divider />
      <div className={styles.tableList}>
        <Table columns={columns} dataSource={bills} />
      </div>
    </Card>
  );
}

export default connect(({ warehouse, dispatch, global }) => ({
  warehouse,
  dispatch,
  global,
}))(BillsTable);
