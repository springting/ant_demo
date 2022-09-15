/* eslint-disable camelcase */
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Button,
  Card,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Tag,
  Input,
  Divider,
  Spin,
  BackTop,
} from 'antd';
// import { UpCircleFilled } from '@ant-design/icons';
import { DraggableArea } from 'react-draggable-tags';
import debounce from 'lodash/debounce';
import deleteBtn from './delete.png';
import styles from '../WareHouse/style.less';

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

const RenderForm = Form.create()(props => {
  const { form, brand_source, dispatch } = props;
  const { getFieldDecorator } = form;
  const handleFormReset = () => {
    form.validateFields(err => {
      if (err) return;
      form.resetFields();
    });
  };

  const handleSearch = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { brand_sid } = fieldsValue;
      dispatch({
        type: 'configtable/fetch',
        payload: { brand_sid, type: 'brand' },
      });
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <Form.Item label="品牌">
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
                {brand_source.map(item => (
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

const CreateForm = Form.create()(props => {
  const {
    form,
    InsertData,
    hideCreateModal,
    store_list,
    modalVisible,
    dispatch,
    category_list,
  } = props;
  const { getFieldDecorator } = form;
  const [fetching, setFetching] = useState(false);

  const onHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const info = { ...fieldsValue, type: 'insert' };
      InsertData(info);
      hideCreateModal();
    });
  };
  const OnSearch = e => {
    if (e && e.length > 1) {
      setFetching(true);
      dispatch({
        type: 'configtable/fetchstoreSource',
        payload: { store: e },
      });
    }
  };
  const onSearch = debounce(OnSearch, 800);

  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="配置"
      visible={modalVisible}
      onOk={onHandle}
      onCancel={hideCreateModal}
    >
      <Fragment>
        <Form.Item {...formItemLayout} label={<span>品牌</span>}>
          {getFieldDecorator('brand', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>品类</span>}>
          {getFieldDecorator('category_sid', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select showSearch allowClear placeholder="请选择品类" style={{ width: '100%' }}>
              {category_list.map(item => (
                <Select.Option key={item.category_name} value={item.sid}>
                  {item.category_name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>店铺资源</span>}>
          {getFieldDecorator('source_store', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select
              showSearch
              allowClear
              mode="multiple"
              placeholder="请选择店铺资源"
              style={{ width: '100%' }}
              onSearch={onSearch}
              notFoundContent={fetching ? <Spin size="small" /> : null}
            >
              {store_list.map(item => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Fragment>
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    form,
    submitData,
    hideModal,
    record,
    store_list,
    visible,
    dispatch,
    stores,
    setStores,
    category_list,
  } = props;
  const { getFieldDecorator } = form;
  const [fetching, setFetching] = useState(false);

  const tagShow = () => {
    const tag = [];
    stores.map(s => {
      tag.push(s.content);
    });
    return tag;
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { sid } = record;
      const { brand_name, regex, category_sid } = fieldsValue;
      const source_store = tagShow();
      const info = { brand_name, source_store, sid, regex, category_sid };
      submitData(info);
      hideModal();
    });
  };
  const OnSearch = e => {
    if (e && e.length >= 1) {
      setFetching(true);
      dispatch({
        type: 'configtable/fetchstoreSource',
        payload: { store: e },
      });
    }
  };
  // 防抖，设置800毫秒内不管用户输入多少个字符，最终只根据最后一次输入完毕后输入框的字符去后台请求匹配数据
  const onSearch = debounce(OnSearch, 800);

  // 使标签可拖动DraggableArea
  // console.log("stores:", stores);
  const tagDelete = tag => {
    const tags = stores.filter(t => tag.id !== t.id);
    setStores(tags);
  };
  const tagChange = tags => {
    setStores(tags);
  };
  const tagSelect = tag => {
    const tags = tagShow();
    if (tags.indexOf(tag) > -1) return;
    stores.push({ id: Math.random(), content: tag });
    setStores(stores);
  };
  const onDeselect = tag => {
    const tags = stores.filter(t => tag !== t.content);
    setStores(tags);
  };
  const onChange = tags => {
    if (tags.length === 0) {
      setStores([]);
    }
  };

  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="配置"
      visible={visible}
      onOk={okHandle}
      onCancel={hideModal}
      record={record}
    >
      <Fragment>
        <Form.Item {...formItemLayout} label={<span>ID</span>}>
          <span>{record.sid}</span>
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>品牌</span>}>
          {getFieldDecorator('brand_name', {
            initialValue: record.brand_name,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>品类</span>}>
          {getFieldDecorator('category_sid', {
            initialValue: record.category_sid,
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select showSearch allowClear placeholder="请选择品类" style={{ width: '100%' }}>
              {category_list.map(item => (
                <Select.Option key={item.category_name} value={item.sid}>
                  {item.category_name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>关键词</span>}>
          {getFieldDecorator('regex', {
            initialValue: record.regex || [],
          })(
            <Select showSearch allowClear mode="tags" style={{ width: '100%' }}>
              {[].map(item => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>店铺资源</span>}>
          <div className={styles.Simple}>
            <DraggableArea
              tags={stores}
              render={({ tag }) => (
                <div className={styles.tag}>
                  <img src={deleteBtn} className={styles.delete} onClick={() => tagDelete(tag)} />
                  {tag.content}
                </div>
              )}
              onChange={tagChange}
            />
          </div>
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>添加店铺</span>}>
          {getFieldDecorator('source_store', {
            initialValue: record.source_store || [],
            rules: [],
          })(
            <Select
              showSearch
              allowClear
              mode="multiple"
              placeholder="请选择店铺资源"
              style={{ width: '100%' }}
              onSearch={onSearch}
              notFoundContent={fetching ? <Spin size="small" /> : null}
              maxTagCount={2}
              onSelect={tagSelect}
              onDeselect={onDeselect}
              onChange={onChange}
            >
              {store_list.map(item => (
                <Select.Option key={item} value={item} label={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Fragment>
    </Modal>
  );
});

const MatchForm = Form.create()(props => {
  const { modalVisible, hideModal, record, loading } = props;
  const columns = [
    {
      title: '渠道',
      dataIndex: 'source',
    },
    {
      title: '店铺',
      dataIndex: 'shopname',
    },
    {
      title: '自动匹配商品次数',
      dataIndex: 'count',
      sorter: (a, b) => a.count.localeCompare(b.count),
    },
    {
      title: '自动匹配商品数量',
      dataIndex: 'num',
      sorter: (a, b) => a.num.localeCompare(b.num),
    },
    {
      title: '匹配数量比例',
      dataIndex: 'percent',
      sorter: (a, b) => a.percent.localeCompare(b.percent),
    },
  ];

  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="种子库匹配详情"
      visible={modalVisible}
      onOk={hideModal}
      onCancel={hideModal}
    >
      <div className={styles.tableList}>
        <Table
          columns={columns}
          dataSource={record}
          size="small"
          pagination={false}
          loading={loading.effects['configtable/fetchItemMatch']}
        />
      </div>
    </Modal>
  );
});

function SourceConfig({ configtable, dispatch, loading, global }) {
  const { store_config, store_list, matches } = configtable;
  const { brand_source, standard_category } = global;
  const [modalVisible, setModalVisible] = useState(false);
  const hideCreateModal = () => setModalVisible(false);
  const [visible, setVisible] = useState(false);
  const [matchvisible, setMatchVisible] = useState(false);
  const hideMatchModal = () => setMatchVisible(false);
  const hideModal = () => setVisible(false);
  const [editingdetail, setEditingdatail] = useState([]);
  const submitData = params => dispatch({ type: 'configtable/confirm', payload: params });
  const InsertData = params => dispatch({ type: 'configtable/insert', payload: params });
  const [stores, setStores] = useState([]);
  const showModal = record => {
    setEditingdatail(record);
    setVisible(true);
    const { source_store } = record;
    const initialTags = [];
    if (source_store) {
      source_store.map((val, index) => {
        initialTags.push({ id: index, content: val });
      });
    }
    setStores(initialTags);
  };

  const showMatchModal = record => {
    dispatch({
      type: 'configtable/fetchItemMatch',
      payload: { standard_brand_sid: record.sid },
    });
    setMatchVisible(true);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'sid',
    },
    {
      title: '品牌',
      dataIndex: 'brand_name',
      width: 200,
    },
    {
      title: '资源店铺',
      dataIndex: 'source_store',
      render: source_store => (
        <span>
          {source_store.map(tag => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </span>
      ),
    },
    {
      title: '编辑',
      width: 120,
      render: record => (
        <span>
          <a onClick={() => showModal(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => showMatchModal(record)}>查看</a>
        </span>
      ),
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <RenderForm brand_source={brand_source} dispatch={dispatch} />
        </div>
        <div className={styles.tableListOperator}>
          <Button icon="plus" type="primary" onClick={() => setModalVisible(true)}>
            添加品牌及资源店铺
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={store_config}
          pagination={false}
          loading={loading.effects['configtable/fetch']}
        />
        {/* <BackTop>
          <UpCircleFilled style={{ fontSize: '40px' }} />
        </BackTop> */}
      </div>
      <CreateForm
        modalVisible={modalVisible}
        hideCreateModal={hideCreateModal}
        InsertData={InsertData}
        store_list={store_list}
        dispatch={dispatch}
        category_list={standard_category}
      />
      <UpdateForm
        visible={visible}
        record={editingdetail}
        store_list={store_list}
        hideModal={hideModal}
        submitData={submitData}
        dispatch={dispatch}
        setStores={setStores}
        stores={stores}
        category_list={standard_category}
      />
      <MatchForm
        modalVisible={matchvisible}
        hideModal={hideMatchModal}
        record={matches}
        dispatch={dispatch}
        loading={loading}
      />
    </Card>
  );
}

export default connect(({ configtable, loading, global }) => ({
  configtable,
  loading,
  global,
}))(SourceConfig);
