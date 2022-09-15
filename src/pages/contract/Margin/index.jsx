/* eslint-disable react/no-array-index-key */
/* eslint-disable camelcase */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Input, Form, Row, Col, Card, Table, Select, Modal, message, Radio } from 'antd';
import styles from './style.less';
import { getManHost } from './utils/utils';
import { currentDate } from '@/utils/utils';

const statusText = {
  created: '待缴费',
  checked: 'checked',
  payed: '已缴费',
  invoiced: 'invoiced',
  deleted: 'deleted',
  refunded: '已退费',
};

const mariginType = undefined;
const { Option } = Select;

// 录入费用modal
@Form.create()
class RecordMarginForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, cancelFunc } = this.props;
    form.validateFields({ force: true }, (err, fieldsValue) => {
      const consort_term_sid = fieldsValue.term_sid.split('|')[0];
      const counter_no = fieldsValue.term_sid.split('|')[1];
      const create_at = currentDate();
      if (!err) {
        dispatch({
          type: 'contractMargin/recordMargin',
          payload: {
            consort_term_sid,
            fee_type_sid: fieldsValue.fee_type_sid,
            amt: Math.round(fieldsValue.amt * 100),
            status: 'payed',
            counter_no,
            create_at,
          },
          callback: res => {
            if (res.err === 0) {
              cancelFunc();
            }
          },
        });
      }
    });
  };

  render() {
    const { recordMarginVisible, cancelFunc, supplyData, form, fee_type_map } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        width={800}
        bodyStyle={{ padding: '32px 20px 48px' }}
        destroyOnClose
        title="录入费用"
        footer={[
          <Button
            onClick={() => {
              cancelFunc();
            }}
          >
            取消
          </Button>,
          <Button htmlType="submit" type="primary" onClick={this.handleSubmit}>
            确认录入
          </Button>,
        ]}
        onOk={() => {
          message.success('你好');
        }}
        visible={recordMarginVisible}
      >
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <p>
            {' '}
            请选择商户：
            {getFieldDecorator('term_sid', {
              rules: [{ required: true, message: '选择商户' }],
            })(
              <Select
                showSearch
                style={{ width: '80%' }}
                placeholder="请选择商户"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  return (
                    option.props.children &&
                    JSON.stringify(option.props.children).indexOf(input) >= 0
                  );
                }}
              >
                <Option value={undefined}>请选择</Option>
                {supplyData &&
                  supplyData.map(v => {
                    return (
                      <Option value={`${v.sid}|${v.counter_no}`} key={v.sid}>
                        [合同号{v.sid}] {v.supply_name} {v.counter_no}
                      </Option>
                    );
                  })}
              </Select>,
            )}
          </p>
          <p>
            费用类型：
            {getFieldDecorator('fee_type_sid', {
              rules: [{ required: true, message: '请输入费用类型' }],
            })(
              <Radio.Group buttonStyle="solid">
                {fee_type_map &&
                  Object.keys(fee_type_map).map((k, idx) => {
                    if (!mariginType || mariginType.indexOf(k) > -1) {
                      return (
                        <Radio key={idx} value={k}>
                          {fee_type_map[k]}
                        </Radio>
                      );
                    }
                    return null;
                  })}
              </Radio.Group>,
            )}
          </p>
          <p>
            费用金额：
            {getFieldDecorator('amt', {
              rules: [{ required: true, message: '请输入费用金额' }],
            })(<Input placeholder="费用" style={{ width: '150px', marginRight: '20px' }} />)}
          </p>
        </Form>
      </Modal>
    );
  }
}

class MarginList extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      recordMarginVisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    // 下拉商户列表
    dispatch({
      type: 'contractMargin/supplyList',
      payload: {
        reportname: 'term_supply_name',
      },
    });
    // 合同类型
    dispatch({
      type: 'contractMargin/fetchFeeType',
    });
    // 费用列表
    dispatch({
      type: 'contractMargin/marginList',
      payload: {
        reportname: 'all_margin',
      },
    });
  }

  // 根据参数选择reportname
  filterReportName = () => {
    const { form } = this.props;
    const values = form.getFieldsValue();
    if (values.margin_sid) {
      return 'query_by_sid';
    }
    return 'term_fee_margin';
  };

  // 参数reset
  paramsReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  // 查询表单提交    进行查询
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, pageSize } = this.props;

    form.validateFields({ force: true }, (err, fieldsValue) => {
      let { margin_sid } = fieldsValue;
      if (margin_sid && margin_sid.indexOf('-') > 0) {
        // eslint-disable-next-line prefer-destructuring
        margin_sid = fieldsValue.margin_sid.split('-')[1];
      }
      const values = {
        ...fieldsValue,
        count: pageSize,
        members: '',
      };
      if (!(fieldsValue.margin_sid || (fieldsValue.term_sid && fieldsValue.fee_type_sid))) {
        message.error('请输入单号或选择费用类型和商户');
        return;
      }
      if (!err) {
        if (fieldsValue.margin_sid) {
          dispatch({
            type: 'contractMargin/marginList2',
            payload: { sequence: margin_sid, tbl: 'standing_book' },
          });
        } else {
          dispatch({
            type: 'contractMargin/marginList',
            payload: {
              ...values,
              reportname: 'term_fee_margin',
            },
          });
        }
      }
    });
  };

  // 关闭录入费用的modal
  cancelFunc = () => {
    this.setState({ recordMarginVisible: false });
  };

  // 退还费用
  refundMargin = record => {
    const { dispatch } = this.props;
    Modal.confirm({
      title: '确认退还么？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'contractMargin/recordMargin',
          payload: {
            sid: record.sid,
            status: 'refunded',
          },
        });
      },
      onCancel: () => {},
    });
  };

  // 缴纳费用
  payMargin = record => {
    const { dispatch, fee_type_map } = this.props;
    Modal.confirm({
      title: (
        <span>
          {`确认已经收到 ${record.supply_name}${
            record.counter_no ? ` ${record.counter_no}` : ''
          } 缴纳的 ${fee_type_map[record.type]} 共`}
          <b style={{ color: 'red' }}>{record.amt / 100}</b>元?
        </span>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'contractMargin/recordMargin',
          payload: {
            sid: record.sid,
            status: 'payed',
          },
        });
      },
      onCancel: () => {},
    });
  };

  render() {
    const { recordMarginVisible } = this.state;
    const { form, fee_type_map, data, supplyData, dispatch } = this.props;
    const { getFieldDecorator } = form;
    const typeFilter = Object.keys(fee_type_map).map(key => ({
      text: fee_type_map[key],
      value: key,
    }));
    const columns = [
      {
        title: '单号',
        dataIndex: 'sequence',
        render: (text, record) => <span>{record.sequence}</span>,
      },
      {
        title: '类型',
        dataIndex: 'type',
        filters: typeFilter,
        onFilter: (value, record) => record.type === value,
        render: (text, record) => <span>{fee_type_map[record.type]}</span>,
      },
      {
        title: '商户',
        dataIndex: 'supply_name',
      },
      {
        title: '柜组号',
        dataIndex: 'counter_no',
      },
      {
        title: '创建时间',
        dataIndex: 'create_at',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => <span>{statusText[record.status]}</span>,
      },
      {
        title: '押金',
        dataIndex: 'amt',
        render: (text, record) => (
          <span style={{ float: 'right' }}>{record.amt && record.amt / 100}元</span>
        ),
      },
      {
        title: '操作',
        render: (text, record) => {
          const printPagePath = '/contracts/margin/printMargin/';
          return (
            <div>
              {record && record.status === 'payed' ? (
                <div>
                  <span
                    style={{ cursor: 'pointer', color: '#1890FF' }}
                    onClick={this.refundMargin.bind(null, record)}
                  >
                    退还
                  </span>
                  &nbsp;|&nbsp;
                  <span>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={getManHost() + printPagePath + record.sid}
                    >
                      打印
                    </a>
                  </span>
                </div>
              ) : null}
              {record && record.status === 'created' ? (
                <span
                  style={{ cursor: 'pointer', color: '#1890FF' }}
                  onClick={this.payMargin.bind(null, record)}
                >
                  缴费
                </span>
              ) : null}
            </div>
          );
        },
      },
    ];
    return (
      <div>
        <Button
          type="primary"
          onClick={() => {
            this.setState({ recordMarginVisible: true });
          }}
        >
          录入费用
        </Button>
        <br />
        <br />
        <Card title="查询条件" bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark>
            <Row>
              <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                费用单号：
                {getFieldDecorator('margin_sid', {
                  rules: [{ required: false, message: '费用单号' }],
                })(
                  <Input placeholder="费用单号" style={{ width: '150px', marginRight: '20px' }} />,
                )}
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                费用类型：
                {getFieldDecorator('fee_type_sid', {
                  rules: [{ required: false, message: '请输入费用类型' }],
                })(
                  <Select showSearch style={{ width: 150 }} placeholder="请选择费用类型">
                    {fee_type_map &&
                      Object.keys(fee_type_map).map(k => {
                        if (!mariginType || mariginType.indexOf(k) > -1) {
                          return <Select.Option value={k}>{fee_type_map[k]}</Select.Option>;
                        }
                        return null;
                      })}
                  </Select>,
                )}
              </Col>
              <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                选择商户：
                {getFieldDecorator('term_sid', {
                  rules: [{ required: false, message: '选择商户' }],
                })(
                  <Select
                    showSearch
                    style={{ width: '80%' }}
                    placeholder="请选择商户"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      return (
                        option.props.children &&
                        JSON.stringify(option.props.children).indexOf(input) >= 0
                      );
                    }}
                  >
                    <Option value={undefined}>全部</Option>
                    {supplyData &&
                      supplyData.map(v => {
                        return (
                          <Option value={v.sid} key={v.sid}>
                            [合同号{v.sid}] {v.supply_name} {v.counter_no}
                          </Option>
                        );
                      })}
                  </Select>,
                )}
              </Col>
            </Row>
            <Row style={{ paddingTop: '10px' }}>
              <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                &nbsp;
                <Button className={styles.submit_btn} onClick={this.paramsReset}>
                  清空
                </Button>{' '}
                &nbsp;
                <Button className={styles.submit_btn} type="primary" htmlType="submit">
                  查询
                </Button>
              </Col>
            </Row>
          </Form>
          <p />
          <Table
            rowKey="sid"
            columns={columns}
            dataSource={data}
            pagination={false}
            onChange={(pagination, filters, sorter, extra) =>
              console.log('params', pagination, filters, sorter, extra)
            }
          />

          <RecordMarginForm
            recordMarginVisible={recordMarginVisible}
            cancelFunc={this.cancelFunc}
            supplyData={supplyData}
            dispatch={dispatch}
            fee_type_map={fee_type_map}
          />
        </Card>
      </div>
    );
  }
}

export default connect(({ contractMargin }) => ({
  data: contractMargin.data.list,
  supplyData: contractMargin.supplyData,
  fee_type_map: contractMargin.fee_type_map,
}))(Form.create()(MarginList));
