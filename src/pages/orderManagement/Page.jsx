/* eslint-disable camelcase */
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import {
  Table,
  Button,
  Card,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  Divider,
  Steps,
  div,
} from 'antd';
import styles from './style.less';

const { RangePicker } = DatePicker;
const { confirm } = Modal;
const { Step } = Steps;
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
  const { form, expressData, hideModal, record, express_list, visible } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { order_no } = record;
      const info = { ...fieldsValue, order_no };
      expressData(info);
      hideModal();
    });
  };
  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="发货"
      visible={visible}
      onOk={okHandle}
      onCancel={hideModal}
      record={record}
    >
      <Fragment key={record.order_no}>
        <Form.Item {...formItemLayout} label={<span>订单号</span>}>
          <span>{record.order_no}</span>
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>快递公司</span>}>
          {getFieldDecorator('logistics', {
            rules: [
              {
                required: true,
              },
            ],
          })(
            <Select
              showSearch
              allowClear
              placeholder="请选择快递公司"
              style={{ width: '100%' }}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {express_list.map(item => (
                <Select.Option key={item.name} value={item.sid} label={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>快递单号</span>}>
          {getFieldDecorator('express_number', {
            rules: [
              {
                required: true,
              },
            ],
          })(<Input placeholder="快递单号" />)}
        </Form.Item>
      </Fragment>
    </Modal>
  );
});

const DetailForm = Form.create()(props => {
  const { form, hideDetail, detailvisible, record, express_detail } = props;
  const onOk = () => {
    form.validateFields(err => {
      if (err) return;
      form.resetFields();
      hideDetail();
    });
  };
  return (
    <Modal
      width={800}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="物流详情"
      visible={detailvisible}
      onOk={onOk}
      onCancel={hideDetail}
      express_detail={express_detail}
      record={record}
    >
      <Fragment>
        <Form.Item {...formItemLayout} label={<span>退货单号</span>}>
          <span>{record.order_no}</span>
        </Form.Item>
        {express_detail && express_detail.data && (
          <Fragment>
            <Form.Item {...formItemLayout} label={<span>物流公司</span>}>
              <span>{express_detail.name}</span>
            </Form.Item>
            <Form.Item {...formItemLayout} label={<span>快递单号</span>}>
              <span>{express_detail.nu}</span>
            </Form.Item>
            <Form.Item {...formItemLayout} label={<span>最新投递数据</span>}>
              <Steps progressDot current={0} direction="vertical" size="small">
                {express_detail.data.map(item => (
                  <Step
                    title={item.context}
                    description={
                      <div>
                        <p>{item.time}</p>
                        <p>{item.status}</p>
                      </div>
                    }
                  />
                ))}
              </Steps>
            </Form.Item>
          </Fragment>
        )}
      </Fragment>
    </Modal>
  );
});

const RenderForm = Form.create()(props => {
  const { form, hideButton, showButton, dispatch, supply_list } = props;
  const { getFieldDecorator } = form;
  const handleFormReset = () => {
    form.validateFields(err => {
      if (err) return;
      form.resetFields();
    });
  };

  const handleSearch = e => {
    e.preventDefault();
    hideButton();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const start_at = fieldsValue.time_range[0].format('YYYY-MM-DD');
      const end_at = fieldsValue.time_range[1].format('YYYY-MM-DD');
      dispatch({
        type: 'ordertable/fetch',
        payload: {
          _start: start_at,
          _end: end_at,
          supply_sid: fieldsValue.supply_sid,
        },
      });
    });
  };
  const handleSearchT = e => {
    e.preventDefault();
    showButton();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const start_at = fieldsValue.time_range[0].format('YYYY-MM-DD');
      const end_at = fieldsValue.time_range[1].format('YYYY-MM-DD');
      dispatch({
        type: 'ordertable/fetchrefund',
        payload: {
          _start: start_at,
          _end: end_at,
          supply_sid: fieldsValue.supply_sid,
        },
      });
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <Form.Item label="时间范围">{getFieldDecorator('time_range')(<RangePicker />)}</Form.Item>
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
                  <Select.Option key={item.supply_name} value={item.sid} label={item.supply_name}>
                    {item.supply_name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <span className={styles.submitButtons}>
            <Button
              type="primary"
              htmlType="submit"
              tyle={{ marginLeft: 8 }}
              onClick={handleSearch}
            >
              销售查询
            </Button>
            <Button tyle={{ marginLeft: 8 }} htmlType="submit" onClick={handleSearchT}>
              退货查询
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

function OrderTable({ ordertable, loading, dispatch, global }) {
  const { orders, express_list, express_detail } = ordertable;
  const { supply_list } = global;
  const [visible, setVisible] = useState(false);
  const [detailvisible, setDetailvisible] = useState(false);
  const hideModal = () => setVisible(false);
  const hideDetail = () => setDetailvisible(false);
  const [editingdetail, setEditingdatail] = useState([]);
  const [buttonvisible, setButtonvisible] = useState(false);
  const hideButton = () => setButtonvisible(false);
  const showButton = () => setButtonvisible(true);
  const expressData = params => dispatch({ type: 'ordertable/confirm', payload: params });
  const deliverGood = record => {
    setEditingdatail(record);
    setVisible(true);
  };
  const getExpressDetail = record => {
    const { order_no } = record;
    dispatch({ type: 'ordertable/clear' });
    dispatch({
      type: 'ordertable/getexpressdetail',
      payload: { refund_no: order_no },
    });
    setEditingdatail(record);
    setDetailvisible(true);
  };
  const refund = record => {
    confirm({
      title: '确认退款?',
      onOk() {
        const { order_no } = record;
        dispatch({
          type: 'ordertable/confirmrefund',
          payload: { refund_no: order_no },
        });
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: '订单号',
      dataIndex: 'order_no',
      sorter: (a, b) => a.order_no.localeCompare(b.order_no),
    },
    {
      title: '订单状态',
      dataIndex: 'extra',
    },
    {
      title: '编辑',
      render: record => (
        <span>
          <a
            style={{ display: buttonvisible ? 'none' : 'inherit' }}
            onClick={() => deliverGood(record)}
          >
            发货
          </a>
          <a style={{ display: buttonvisible ? 'inherit' : 'none' }} onClick={() => refund(record)}>
            退款
          </a>
          <Divider type="vertical" />
          <a
            style={{ display: buttonvisible ? 'inherit' : 'none' }}
            onClick={() => getExpressDetail(record)}
          >
            查看物流
          </a>
        </span>
      ),
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <RenderForm
            hideButton={hideButton}
            showButton={showButton}
            dispatch={dispatch}
            supply_list={supply_list}
          />
        </div>
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading.effects['ordertable/fetch']}
        />
      </div>
      <CreateForm
        visible={visible}
        record={editingdetail}
        express_list={express_list}
        hideModal={hideModal}
        expressData={expressData}
      />
      <DetailForm
        detailvisible={detailvisible}
        express_detail={express_detail}
        record={editingdetail}
        hideDetail={hideDetail}
      />
    </Card>
  );
}

export default connect(({ ordertable, loading, global }) => ({
  ordertable,
  loading,
  global,
}))(OrderTable);
