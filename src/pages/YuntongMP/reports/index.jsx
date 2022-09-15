/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'dva';
import { Table, Card, Form, Row, Col, Button, DatePicker } from 'antd';
import styles from '../../WareHouse/style.less';

const { RangePicker } = DatePicker;

const RenderForm = Form.create()(props => {
  const { form, dispatch } = props;
  const { getFieldDecorator } = form;

  const handleSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const start_at = fieldsValue.time_range[0].format('YYYY-MM-DD HH:mm:00');
      const end_at = fieldsValue.time_range[1].format('YYYY-MM-DD HH:mm:00');
      dispatch({
        type: 'reporttable/fetchupdate',
        payload: { start_at, end_at, type: 'goods_update' },
      });
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={12} sm={24}>
          <Form.Item label="时间范围">
            {getFieldDecorator('time_range')(
              <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />,
            )}
          </Form.Item>
        </Col>
        <Col md={4} sm={12}>
          <span className={styles.submitButtons}>
            <Button type="primary" tyle={{ marginLeft: 8 }} onClick={handleSearch}>
              查询
            </Button>
          </span>
        </Col>
      </Row>
    </Form>
  );
});

const TimeRender = Form.create()(props => {
  const { form, dispatch } = props;
  const { getFieldDecorator } = form;

  const handleSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const start_at = fieldsValue.time_range[0].format('YYYY-MM-DD HH:mm:00');
      const end_at = fieldsValue.time_range[1].format('YYYY-MM-DD HH:mm:00');
      dispatch({
        type: 'reporttable/fetchmanual',
        payload: { start_at, end_at, type: 'items_manual' },
      });
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={12} sm={24}>
          <Form.Item label="时间范围">
            {getFieldDecorator('time_range')(
              <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />,
            )}
          </Form.Item>
        </Col>
        <Col md={4} sm={12}>
          <span className={styles.submitButtons}>
            <Button type="primary" tyle={{ marginLeft: 8 }} onClick={handleSearch}>
              查询
            </Button>
          </span>
        </Col>
      </Row>
    </Form>
  );
});

function Reporttable({ reporttable, loading, dispatch }) {
  const { goods_overview, goods_update, items_manual } = reporttable;

  const handleSearch = () => {
    dispatch({
      type: 'reporttable/fetch',
      payload: { type: 'goods_overview' },
    });
  };
  const expandedRemainRowRender = goods_overview => {
    const columns = [
      { title: '渠道', dataIndex: 'source', key: 'source' },
      {
        title: '未抓取种子入口数量',
        dataIndex: 'entries_cnt',
        key: 'entries_cnt',
        sorter: (a, b) => a.entries_cnt - b.entries_cnt,
      },
      {
        title: '未抓取图片数量',
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
      },
    ];
    const data = goods_overview.good_source_remain;
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  const goods_columns = [
    {
      title: '总商品数',
      dataIndex: 'goods_cnt',
      key: 'goods_cnt',
    },
    {
      title: '匹配商品数',
      dataIndex: 'items_cnt',
      key: 'items_cnt',
    },
    {
      title: '7天未抓取种子入口数(重点店铺)',
      dataIndex: 'key_entries_remain',
      key: 'key_entries_remain',
    },
    {
      title: '7天未抓取种子入口数(所有店铺)',
      dataIndex: 'entries_remain',
      key: 'entries_remain',
    },
    {
      title: '未抓取图片总数(所有店铺)',
      dataIndex: 'goods_remain',
      key: 'goods_remain',
    },
  ];

  const expandedUpdateRowRender = goods_update => {
    const columns = [
      { title: '渠道', dataIndex: '_id', key: '_id' },
      { title: '抓取商品数量', dataIndex: 'count', key: 'count' },
    ];
    const data = goods_update.good_source_update;
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  const update_columns = [
    {
      title: '抓取种子总数(重点店铺)',
      dataIndex: 'key_entries_update',
      key: 'key_entries_update',
    },
    {
      title: '抓取图片总数(重点店铺)',
      dataIndex: 'key_goods_update',
      key: 'key_goods_update',
    },
    {
      title: '抓取种子总数(所有店铺)',
      dataIndex: 'entries_update',
      key: 'entries_update',
    },
    {
      title: '抓取图片总数(所有店铺)',
      dataIndex: 'goods_update',
      key: 'goods_update',
    },
  ];

  const manual_columns = [
    {
      title: '类型',
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
    },
    {
      title: '订单号',
      dataIndex: 'bill_sid',
      sorter: (a, b) => a.bill_sid - b.bill_sid,
    },
    {
      title: '品牌',
      dataIndex: 'brand',
    },
    {
      title: '门店',
      dataIndex: 'shop',
      sorter: (a, b) => a.shop.localeCompare(b.shop),
    },
    {
      title: '渠道',
      dataIndex: 'source',
    },
    {
      title: '店铺',
      dataIndex: 'shopname',
    },
    {
      title: '是否纳入种子店铺',
      dataIndex: 'isInEntries',
      sorter: (a, b) => a.isInEntries.localeCompare(b.isInEntries),
    },
    {
      title: '手动匹配URL',
      dataIndex: 'url',
    },
    {
      title: '删除图片URL',
      dataIndex: 'pic',
    },
  ];

  return (
    <div>
      <Card>
        <div className={styles.tableList}>
          <h3>图库池概况</h3>
          <Button type="primary" style={{ marginTop: '30px' }} onClick={handleSearch}>
            查询
          </Button>
          <Table
            columns={goods_columns}
            dataSource={goods_overview}
            loading={loading.effects['reporttable/fetch']}
            pagination={false}
            expandedRowRender={expandedRemainRowRender}
          />
        </div>
      </Card>
      <Card style={{ margin: '30px 0' }}>
        <div className={styles.tableList}>
          <h3>图片池抓取概况</h3>
          <div className={styles.tableListForm} style={{ marginTop: '30px' }}>
            <RenderForm dispatch={dispatch} />
          </div>
          <Table
            columns={update_columns}
            dataSource={goods_update}
            loading={loading.effects['reporttable/fetchupdate']}
            pagination={false}
            expandedRowRender={expandedUpdateRowRender}
          />
        </div>
      </Card>
      <Card style={{ margin: '30px 0' }}>
        <div className={styles.tableList}>
          <h3>手动匹配数据</h3>
          <div className={styles.tableListForm} style={{ marginTop: '30px' }}>
            <TimeRender dispatch={dispatch} />
          </div>
          <Table
            columns={manual_columns}
            dataSource={items_manual}
            loading={loading.effects['reporttable/fetchmanual']}
            pagination={false}
          />
        </div>
      </Card>
    </div>
  );
}

export default connect(({ reporttable, loading, global }) => ({
  reporttable,
  loading,
  global,
}))(Reporttable);
