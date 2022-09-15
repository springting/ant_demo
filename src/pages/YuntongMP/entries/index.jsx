/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import { Table, Card, Modal, Form, Select, Row, Col, Button, Divider, message } from 'antd';
import debounce from 'lodash/debounce';
import styles from '../../WareHouse/style.less';

const RenderForm = Form.create()(props => {
  const {
    form,
    store_list,
    brands,
    dispatch,
    setEntryVisible,
    setDefaultStandardSid,
    setDefaultStore,
    default_brand_sid,
    default_store,
  } = props;
  const { getFieldDecorator } = form;

  const OnSearch = e => {
    if (e && e.length >= 1) {
      dispatch({
        type: 'entrytable/fetchstoreSource',
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
          type: 'entrytable/fetchentries',
          payload: { store, type: 'fetch_entries' },
        });
      } else {
        setDefaultStore(undefined);
        setDefaultStandardSid(brand_sid);
        dispatch({
          type: 'entrytable/fetchentries',
          payload: { brand_sid, type: 'fetch_entries' },
        });
      }
    });
  };

  const handleLpush = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { brand_sid, store } = fieldsValue;
      if (store) {
        setDefaultStore(store);
        setDefaultStandardSid(undefined);
        dispatch({
          type: 'entrytable/fetchentries',
          payload: { source_store: store, default_store, type: 'lpush_entries' },
        });
      } else if (brand_sid) {
        setDefaultStore(undefined);
        setDefaultStandardSid(brand_sid);
        dispatch({
          type: 'entrytable/fetchentries',
          payload: { brand_sid, default_brand_sid, type: 'lpush_entries' },
        });
      }
    });
  };

  const fetchEntryList = () => {
    dispatch({
      type: 'entrytable/fetchentries',
      payload: { type: 'entry_list' },
    });
    setEntryVisible(true);
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
            <Button icon="table" onClick={fetchEntryList} style={{ marginLeft: '8px' }}>
              抓种子队列
            </Button>
          </span>
        </Col>
      </Row>
    </Form>
  );
});

const EntryForm = Form.create()(props => {
  const { modalVisible, hideModal, record, dispatch } = props;

  const deleteEntryList = info => {
    dispatch({
      type: 'entrytable/fetchentries',
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

function EntryTable({ entrytable, loading, dispatch, global }) {
  const { entries, store_list, entry_list } = entrytable;
  const { brand_source } = global;
  const [entryVisible, setEntryVisible] = useState(false);
  const hideEntryModal = () => setEntryVisible(false);
  const [default_store, setDefaultStore] = useState(undefined);
  const [default_brand_sid, setDefaultStandardSid] = useState(undefined);

  const deleteEntry = record => {
    dispatch({
      type: 'entrytable/fetchentries',
      payload: {
        store: record[1],
        source: record[3],
        default_store,
        default_brand_sid,
        type: 'delete_entries',
      },
    });
  };

  const onLpush = record => {
    dispatch({
      type: 'entrytable/fetchentries',
      payload: {
        store: record[1],
        source: record[3],
        default_store,
        default_brand_sid,
        type: 'lpush_entries',
      },
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
      title: '是否已抓种子',
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
      width: 170,
      render: record => (
        <span>
          <a onClick={() => onLpush(record)}>插队</a>
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
          <RenderForm
            store_list={store_list}
            dispatch={dispatch}
            brands={brand_source}
            setEntryVisible={setEntryVisible}
            setDefaultStore={setDefaultStore}
            setDefaultStandardSid={setDefaultStandardSid}
            default_brand_sid={default_brand_sid}
            default_store={default_store}
          />
        </div>
        <Table
          columns={columns}
          dataSource={entries}
          loading={loading.effects['entrytable/fetchentries']}
        />
      </div>
      <EntryForm
        modalVisible={entryVisible}
        hideModal={hideEntryModal}
        record={entry_list}
        dispatch={dispatch}
      />
    </Card>
  );
}

export default connect(({ entrytable, loading, global }) => ({
  entrytable,
  loading,
  global,
}))(EntryTable);
