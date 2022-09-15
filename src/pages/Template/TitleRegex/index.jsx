/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import { Button, Card, Form, Select, Row, Col, Table, Modal } from 'antd';
import styles from '../index.less';

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
  const { form, supply_list, shop_list, dispatch } = props;
  const { getFieldDecorator } = form;

  const handleSearch = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { shop_sid, supply_sid } = fieldsValue;
      dispatch({
        type: 'regextable/fetch',
        payload: { shop_sid, supply_sid },
      });
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
        <Col md={8} sm={24}>
          <Form.Item label="门店">
            {getFieldDecorator('shop_sid')(
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {shop_list.map(item => (
                  <Select.Option key={item.sh_conc} value={item.sid} label={item.sh_conc}>
                    {item.sh_conc}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <Form.Item label="供应商">
            {getFieldDecorator('supply_sid')(
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
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

const CreateForm = Form.create()(props => {
  const { form, hideModal, visible, record, dispatch, detail, showType } = props;
  const { getFieldDecorator } = form;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dispatch({
        type: 'regextable/addTemplate',
        payload: {
          type: 'title_regex',
          supply_sid: record.sid,
          shop_sid: record.shop_sid,
          formItem: fieldsValue,
        },
      });
      hideModal();
    });
  };

  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="编辑标题过滤模板"
      visible={visible}
      onOk={okHandle}
      onCancel={hideModal}
      record={record}
    >
      {showType === 'supply' && (
        <Form>
          <Form.Item {...formItemLayout} label={<span>供应商</span>}>
            <span>{record.sup_info}</span>
          </Form.Item>
          <Form.Item {...formItemLayout} label={<span>前缀</span>}>
            {getFieldDecorator('PRE', {
              initialValue: detail.PRE || [],
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
          <Form.Item {...formItemLayout} label={<span>后缀</span>}>
            {getFieldDecorator('SUF', {
              initialValue: detail.SUF || [],
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
          {/* <Form.Item {...formItemLayout} label={<span>删除</span>}>
            {getFieldDecorator('DEL', {
              initialValue: detail.DEL || [],
            })(
              <Select showSearch allowClear mode="tags" style={{ width: '100%' }}>
                {[].map(item => (
                  <Select.Option key={item} value={item} label={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item> */}
        </Form>
      )}
      {showType === 'shop' && (
        <Form>
          <Form.Item {...formItemLayout} label={<span>门店</span>}>
            <span>{record.sh_conc}</span>
          </Form.Item>
          <Form.Item {...formItemLayout} label={<span>删除</span>}>
            {getFieldDecorator('DEL', {
              initialValue: detail.DEL || [],
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
        </Form>
      )}
    </Modal>
  );
});

function TitleList({ regextable, loading, dispatch, global }) {
  const { titleRegexs, detail } = regextable;
  const { supply_list, shop_list } = global;
  const [visible, setVisible] = useState(false);
  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);
  const [editingdatail, setEditingdatail] = useState({});
  const [showType, setShowType] = useState();

  const onEdit = record => {
    if (record.sid) {
      setShowType('supply');
    } else {
      setShowType('shop');
    }
    dispatch({
      type: 'regextable/fetchRegexDetail',
      payload: { shop_sid: record.shop_sid, supply_sid: record.sid, type: 'title_regex' },
    });
    showModal();
    setEditingdatail(record);
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
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      render: record => <a onClick={() => onEdit(record)}>编辑</a>,
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <RenderForm supply_list={supply_list} shop_list={shop_list} dispatch={dispatch} />
        </div>
        <Table
          columns={columns}
          dataSource={titleRegexs}
          loading={loading.effects['regextable/fetch']}
        />
      </div>
      <CreateForm
        visible={visible}
        hideModal={hideModal}
        record={editingdatail}
        dispatch={dispatch}
        detail={detail}
        showType={showType}
      />
    </Card>
  );
}

export default connect(({ regextable, loading, dispatch, global }) => ({
  regextable,
  loading,
  dispatch,
  global,
}))(TitleList);
