/* eslint-disable camelcase */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Select,
  Modal,
  Button,
  // Divider,
  message,
} from 'antd';
import StandardTable from './components/StandardTable';
import DetailForm from './components/DetailForm';
import { COMPANY_ID, settleMode } from '@/settings';

import styles from './style.less';

const FormItem = Form.Item;

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, contractContractList } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.model !== 'ZL' && fieldsValue.brand_token.length === 0) {
        message.error('除租赁外，其他合同必须填写签约品牌！');
        return;
      }
      form.resetFields();
      const start_at = fieldsValue.date[0].format('YYYYMMDD');
      const end_at = fieldsValue.date[1].format('YYYYMMDD');
      const param = {
        ...fieldsValue,
        start_at,
        end_at,
        tbl: 'consort_terms',
        trans_rate_model: 4,
        company_sid: COMPANY_ID,
      };
      // param.admin_fee_regex = param.admin_fee_regex ? JSON.stringify({...param.admin_fee_regex, start: start_at, end: end_at}) : null;
      // param.rental_regex = param.rental_regex ? JSON.stringify({...param.rental_regex, start: start_at, end: end_at}) : null;
      // param.deduction_rate_regex = param.deduction_rate_regex ? param.deduction_rate_regex.map(e=>JSON.stringify(e)).join("|") : null;
      if (param.brand_token) param.brand_token = param.brand_token.join();
      delete param.date;
      handleAdd(param);
    });
  };
  return (
    <Modal
      width={720}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="录入合同"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <DetailForm form={form} contractContractList={contractContractList} />
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOk = () => {
    const {
      form,
      handleUpdate,
      contractContractList: { editingDetail },
    } = this.props;
    const oldValue = { ...editingDetail, tbl: 'consort_terms' };
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const param = fieldsValue;
      const start_at = param.date[0].format('YYYYMMDD');
      const end_at = param.date[1].format('YYYYMMDD');
      const formVals = { ...oldValue, ...param, start_at, end_at };
      if (formVals.brand_token) formVals.brand_token = formVals.brand_token.join();
      delete formVals.date;
      handleUpdate(formVals);
    });
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, contractContractList, form } = this.props;
    const { editingDetail } = contractContractList;
    return (
      <Modal
        width={720}
        bodyStyle={{ padding: '32px 20px 48px' }}
        destroyOnClose
        title="修改合同"
        visible={updateModalVisible}
        onOk={this.handleOk}
        onCancel={() => handleUpdateModalVisible(false, editingDetail)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <DetailForm form={form} contractContractList={contractContractList} />
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ contractContractList, loading }) => ({
  contractContractList,
  loading: loading.models.rule,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
  };

  columns = [
    {
      title: '合同号',
      dataIndex: 'sid',
    },
    {
      title: '门店',
      dataIndex: 'shop_sid',
      // eslint-disable-next-line react/destructuring-assignment
      render: val => {
        const {
          contractContractList: { shop_list },
        } = this.props;
        return (
          (shop_list.filter(item => item.sid.toString() === val.toString())[0] || {}).shop_name ||
          val
        );
      },
    },
    {
      title: '供应商',
      dataIndex: 'supply_sid',
      render: val => {
        // eslint-disable-next-line react/destructuring-assignment
        const {
          contractContractList: { supply_list },
        } = this.props;
        const sidMap = {};
        // eslint-disable-next-line no-return-assign
        (supply_list || []).forEach(item => (sidMap[item.sid] = item.supply_name));
        return sidMap[val] || val;
      },
    },
    {
      title: '结算模型',
      dataIndex: 'model',
      align: 'center',
      render: val => settleMode[val],
      filters: Object.keys(settleMode).map(k => ({ text: settleMode[k], value: k })),
      onFilter: (value, record) => record.model === value,
    },
    {
      title: '开始日期',
      dataIndex: 'start_at',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '结束日期',
      dataIndex: 'end_at',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {/* <a onClick={() => this.handleUpdateModalVisible(true, record)}>续签</a>
          <Divider type="vertical" /> */}
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改合同</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'contractContractList/fetch',
      payload: { company_sid: COMPANY_ID },
    });
    dispatch({ type: 'contractContractList/fetchSupplies' });
    dispatch({ type: 'contractContractList/fetchFeeType' });
    dispatch({ type: 'contractContractList/fetchTransRate' });
    dispatch({ type: 'contractContractList/fetchShopList' });
  }

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { name } = fieldsValue;
      dispatch({
        type: 'contractContractList/fetch',
        payload: { company_sid: COMPANY_ID, supply_sid: name },
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    const {
      dispatch,
      contractContractList: { editingDetail },
    } = this.props;
    if (
      flag &&
      record &&
      record.sid &&
      (Object.keys(editingDetail).length === 0 || editingDetail.sid !== record.sid)
    ) {
      dispatch({ type: 'contractContractList/clear' });
      dispatch({
        type: 'contractContractList/detail',
        payload: { sid: record.sid, tbl: 'consort_terms' },
      });
    }
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contractContractList/add',
      payload: fields,
    });
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'contractContractList/add',
      payload: fields,
    });

    message.success('修改成功');
    this.handleUpdateModalVisible();
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      contractContractList: { supply_list },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="供应商">
              {getFieldDecorator('name')(
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {supply_list &&
                    supply_list.map(item => (
                      <Select.Option key={item.sid} value={item.sid}>
                        {item.supply_name}
                      </Select.Option>
                    ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { contractContractList, loading, dispatch } = this.props;
    const { data } = contractContractList;
    const { modalVisible, updateModalVisible } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      contractContractList,
    };
    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() =>
                  dispatch({ type: 'contractContractList/clear' }) && this.handleModalVisible(true)
                }
              >
                新建
              </Button>
            </div>
            <StandardTable loading={loading} data={data} columns={this.columns} />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          contractContractList={contractContractList}
        />
        <UpdateForm {...updateMethods} updateModalVisible={updateModalVisible} />
      </Fragment>
    );
  }
}

export default TableList;
