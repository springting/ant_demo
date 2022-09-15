/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Form, Select, Row, Col, Modal, Divider, message } from 'antd';
import styles from '../WareHouse/style.less';

const bntStyle = {
  marginRight: '10px',
};

const CreateForm = Form.create()(props => {
  const { modalVisible, hideModal, record, loading, dispatch } = props;

  const lpushShopList = info => {
    dispatch({
      type: 'configtable/fetchgoods',
      payload: { store: info.shopname, source: info.source, type: 'lpush_shop' },
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
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="剩余种子详情"
      visible={modalVisible}
      onOk={hideModal}
      onCancel={hideModal}
    >
      <div className={styles.tableList}>
        <Table
          columns={columns}
          dataSource={record}
          size="small"
          loading={loading.effects['configtable/fetchgoods']}
        />
      </div>
    </Modal>
  );
});

const QueseForm = Form.create()(props => {
  const { modalVisible, hideModal, record, loading, dispatch } = props;

  const deleteShopList = info => {
    dispatch({
      type: 'configtable/fetchgoods',
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
      title: '剩余数量',
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
          loading={loading.effects['configtable/fetchqueue']}
        />
      </div>
    </Modal>
  );
});

const EntryForm = Form.create()(props => {
  const { modalVisible, hideModal, record, dispatch } = props;

  const deleteEntryList = info => {
    dispatch({
      type: 'configtable/fetchentries',
      payload: { store: info.shopname, source: info.source, type: 'deleteFromEntryList' },
    });
  };

  const columns = [
    {
      title: '店铺',
      dataIndex: 'shopname',
    },
    {
      title: '渠道',
      dataIndex: 'source',
    },
    {
      title: '编辑',
      width: 100,
      render: info => <a onClick={() => deleteEntryList(info)}>删除</a>,
    },
  ];

  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="抓种子队列详情"
      visible={modalVisible}
      onOk={hideModal}
      onCancel={hideModal}
    >
      <div className={styles.tableList}>
        <Table columns={columns} dataSource={record} size="small" />
      </div>
    </Modal>
  );
});

const RenderForm = Form.create()(props => {
  const { form, store_list, store_config, dispatch } = props;
  const { getFieldDecorator } = form;
  const handleFormReset = () => {
    form.validateFields(err => {
      if (err) return;
      form.resetFields();
    });
  };

  const onSearch = e => {
    if (e && e.length > 1) {
      dispatch({
        type: 'configtable/fetchstoreSource',
        payload: { store: e },
      });
    }
  };

  const handleUpdate = () => {
    dispatch({
      type: 'configtable/fetchqueue',
      payload: { type: 'refresh_store' },
    });
  };

  const handleSearch = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { brand_sid, store } = fieldsValue;
      if (store) {
        dispatch({
          type: 'configtable/fetchentries',
          payload: { store, type: 'fetch_entries' },
        });
      } else {
        dispatch({
          type: 'configtable/fetchentries',
          payload: { brand_sid, type: 'fetch_entries' },
        });
      }
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={6} sm={12}>
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
                {store_config.map(item => (
                  <Select.Option key={item.brand_name} value={item.sid} label={item.brand_name}>
                    {item.brand_name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <span className={styles.submitButtons}>
            <Button type="primary" style={{ marginLeft: 8 }} onClick={handleSearch}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleUpdate}>
              同步店铺
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

function RPAConfig({ configtable, loading, dispatch }) {
  const { store_list, goods, shop_list, entries, store_config, entry_list } = configtable;
  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = () => setModalVisible(false);
  const [queseVisible, setQueseVisible] = useState(false);
  const hideQueseModal = () => setQueseVisible(false);
  const [entryVisible, setEntryVisible] = useState(false);
  const hideEntryModal = () => setEntryVisible(false);
  const onRefresh = () => {
    dispatch({
      type: 'configtable/fetchgoods',
      payload: { type: 'fetch_goods' },
    });
    setModalVisible(true);
  };

  const fetchQueue = () => {
    dispatch({
      type: 'configtable/fetchgoods',
      payload: { type: 'shop_list' },
    });
    setQueseVisible(true);
  };

  const fetchEntry = () => {
    dispatch({
      type: 'configtable/fetchentries',
      payload: { type: 'entry_list' },
    });
    setEntryVisible(true);
  };

  const deleteEntry = record => {
    dispatch({
      type: 'configtable/fetchentries',
      payload: { store: record[1], type: 'delete_entries' },
    });
  };

  const onLpush = record => {
    dispatch({
      type: 'configtable/fetchentries',
      payload: { store: record[1], source: record[3], type: 'lpush_entries' },
    });
  };

  const onCopy = record => {
    const oInput = document.createElement('input');
    oInput.value = record[2];
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand('Copy'); // 执行浏览器复制命令
    message.success('复制成功');
    oInput.remove();
  };

  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 100,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '店铺',
      dataIndex: 1,
      sorter: (a, b) => a[1].localeCompare(b[1]),
    },
    {
      title: '来源',
      dataIndex: 3,
      sorter: (a, b) => a[3].localeCompare(b[3]),
    },
    {
      title: '创建时间',
      dataIndex: 4,
      sorter: (a, b) => a[4].localeCompare(b[4]),
    },
    {
      title: '更新时间',
      dataIndex: 5,
    },
    {
      title: '是否已抓图',
      dataIndex: 6,
      sorter: (a, b) => a[6].localeCompare(b[6]),
    },
    {
      title: '是否已插队',
      dataIndex: 7,
      sorter: (a, b) => a[7].localeCompare(b[7]),
    },
    {
      title: '每页商品数',
      dataIndex: 8,
    },
    {
      title: '抓取进度',
      dataIndex: 10,
    },
    {
      title: '编辑',
      render: record => (
        <span>
          <a onClick={() => onLpush(record)}>抓种子插队</a>
          <Divider type="vertical" />
          <a onClick={() => onCopy(record)}>复制url</a>
          <Divider type="vertical" />
          <a onClick={() => deleteEntry(record)}>删除</a>
        </span>
      ),
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <RenderForm store_list={store_list} dispatch={dispatch} store_config={store_config} />
        </div>
        <Button icon="table" type="primary" onClick={onRefresh} style={bntStyle}>
          剩余种子详情
        </Button>
        <Button icon="table" onClick={fetchQueue} style={bntStyle}>
          抓图队列
        </Button>
        <Button icon="table" onClick={fetchEntry} style={bntStyle}>
          抓种子队列
        </Button>
        <CreateForm
          modalVisible={modalVisible}
          hideModal={hideModal}
          record={goods}
          loading={loading}
          dispatch={dispatch}
        />
        <QueseForm
          modalVisible={queseVisible}
          hideModal={hideQueseModal}
          record={shop_list}
          loading={loading}
          dispatch={dispatch}
        />
        <EntryForm
          modalVisible={entryVisible}
          hideModal={hideEntryModal}
          record={entry_list}
          dispatch={dispatch}
        />
        <Table
          columns={columns}
          dataSource={entries}
          pagination={false}
          loading={loading.effects['configtable/fetchentries']}
        />
      </div>
    </Card>
  );
}

export default connect(({ configtable, loading }) => ({
  configtable,
  loading,
}))(RPAConfig);
