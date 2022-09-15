/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Form, Select, Row, Col, Button } from 'antd';
import debounce from 'lodash/debounce';
import styles from '../../WareHouse/style.less';

const RenderForm = Form.create()(props => {
  const {
    form,
    store_list,
    brands,
    dispatch,
    setGoodVisible,
    setDefaultStandardSid,
    setDefaultStore,
    default_brand_sid,
  } = props;
  const { getFieldDecorator } = form;

  const OnSearch = e => {
    if (e && e.length >= 1) {
      dispatch({
        type: 'goodtable/fetchstoreSource',
        payload: { store: e },
      });
    }
  };
  const onSearch = debounce(OnSearch, 800);

  const handleSearch = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { brand_sid, store } = fieldsValue;
      if (store) {
        setDefaultStore(store);
        setDefaultStandardSid(undefined);
        dispatch({
          type: 'goodtable/fetchgoods',
          payload: { store, type: 'fetch_goods' },
        });
      } else {
        setDefaultStore(undefined);
        setDefaultStandardSid(brand_sid);
        dispatch({
          type: 'goodtable/fetchgoods',
          payload: { brand_sid, type: 'fetch_goods' },
        });
      }
    });
  };

  const handleLpush = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { brand_sid } = fieldsValue;
      if (brand_sid) {
        setDefaultStore(undefined);
        setDefaultStandardSid(brand_sid);
        dispatch({
          type: 'goodtable/fetchgoods',
          payload: { brand_sid, default_brand_sid, type: 'lpush_shop' },
        });
      }
    });
  };

  const fetchShopList = () => {
    dispatch({
      type: 'goodtable/fetchgoods',
      payload: { type: 'shop_list' },
    });
    setGoodVisible(true);
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <Form.Item label="品牌池">
            {getFieldDecorator('brand_sid')(
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
                  <Select.Option key={item.brand_name} value={item.sid} label={item.brand_name}>
                    {item.brand_name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Form.Item label="店铺">
            {getFieldDecorator('store')(
              <Select showSearch allowClear style={{ width: '100%' }} onSearch={onSearch}>
                {store_list.map(item => (
                  <Select.Option key={item} value={item} label={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={4} sm={12}>
          <span className={styles.submitButtons}>
            <Button type="primary" onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleLpush} style={{ marginLeft: '18px' }}>
              批量插队
            </Button>
            <Button icon="table" onClick={fetchShopList} style={{ marginLeft: '10px' }}>
              抓图队列
            </Button>
          </span>
        </Col>
      </Row>
    </Form>
  );
});

const GoodForm = Form.create()(props => {
  const { modalVisible, hideModal, record, dispatch, loading } = props;

  const deleteShopList = info => {
    dispatch({
      type: 'goodtable/fetchgoods',
      payload: { store: info[0], source: info[1], type: 'deleteFromShopList' },
    });
  };

  const columns = [
    {
      title: '店铺',
      dataIndex: 0,
      key: 0,
    },
    {
      title: '未抓取数量',
      dataIndex: 2,
      key: 2,
    },
    {
      title: '渠道',
      dataIndex: 1,
      key: 1,
    },
    {
      title: '编辑',
      width: 100,
      render: info => <a onClick={() => deleteShopList(info)}>删除</a>,
    },
  ];

  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="抓图队列详情"
      visible={modalVisible}
      onOk={hideModal}
      onCancel={hideModal}
    >
      <div className={styles.tableList}>
        <Table
          columns={columns}
          dataSource={record}
          size="small"
          loading={loading.effects['goodtable/fetchgoods']}
        />
      </div>
    </Modal>
  );
});

function Goodtable({ goodtable, loading, dispatch, global }) {
  const { goods, store_list, shop_list } = goodtable;
  const { brand_source } = global;
  const [goodVisible, setGoodVisible] = useState(false);
  const hideGoodModal = () => setGoodVisible(false);
  const [default_store, setDefaultStore] = useState(undefined);
  const [default_brand_sid, setDefaultStandardSid] = useState(undefined);

  const lpushShopList = info => {
    dispatch({
      type: 'goodtable/fetchgoods',
      payload: {
        store: info.shopname,
        source: info.source,
        default_store,
        default_brand_sid,
        type: 'lpush_shop',
      },
    });
  };

  const columns = [
    {
      title: '店铺',
      dataIndex: 'shopname',
      sorter: (a, b) => a.shopname.localeCompare(b.shopname),
    },
    {
      title: '渠道',
      dataIndex: 'source',
      sorter: (a, b) => a.source.localeCompare(b.source),
    },
    {
      title: '剩余数量',
      dataIndex: 'count',
      sorter: (a, b) => a.count - b.count,
    },
    {
      title: '最新更新时间',
      dataIndex: 'create_at',
      sorter: (a, b) => a.create_at.localeCompare(b.create_at),
    },
    {
      title: '是否已插队',
      dataIndex: 'isInList',
      sorter: (a, b) => a.isInList.localeCompare(b.isInList),
    },
    {
      title: '编辑',
      width: 100,
      render: info => <a onClick={() => lpushShopList(info)}>插队</a>,
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <RenderForm
            store_list={store_list}
            dispatch={dispatch}
            brands={brand_source}
            setGoodVisible={setGoodVisible}
            setDefaultStore={setDefaultStore}
            setDefaultStandardSid={setDefaultStandardSid}
            default_brand_sid={default_brand_sid}
          />
        </div>
        <Table
          columns={columns}
          dataSource={goods}
          loading={loading.effects['goodtable/fetchgoods']}
        />
      </div>
      <GoodForm
        modalVisible={goodVisible}
        hideModal={hideGoodModal}
        record={shop_list}
        dispatch={dispatch}
        loading={loading}
      />
    </Card>
  );
}

export default connect(({ goodtable, loading, global }) => ({
  goodtable,
  loading,
  global,
}))(Goodtable);
