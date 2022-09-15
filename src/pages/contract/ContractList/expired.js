/* eslint-disable camelcase */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table } from 'antd';
import { COMPANY_ID, settleMode } from '@/settings';

/* eslint react/no-multi-comp:0 */
@connect(({ contractContractList, loading }) => ({
  contractContractList,
  loading,
}))
class TableList extends PureComponent {
  columns = [
    {
      title: '合同号',
      dataIndex: '合同号',
    },
    {
      title: '门店',
      dataIndex: '门店号',
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
      dataIndex: '供应商号',
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
      title: '合作模式',
      dataIndex: '合作模式',
      align: 'center',
      render: val => settleMode[val],
      filters: Object.keys(settleMode).map(k => ({ text: settleMode[k], value: k })),
      onFilter: (value, record) => record.model === value,
    },
    {
      title: '开始日期',
      dataIndex: '开始日期',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '截止日期',
      dataIndex: '截止日期',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'contractContractList/fetchExpired',
      payload: { company_sid: COMPANY_ID },
    });
    dispatch({ type: 'contractContractList/fetchSupplies' });
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

  render() {
    const { contractContractList, loading } = this.props;
    const {
      expired: { th, td },
    } = contractContractList;
    const data = [];
    if (td) {
      td.forEach(element => {
        const item = {};
        // eslint-disable-next-line no-return-assign
        th.forEach((k, i) => (item[k] = element[i]));
        data.push(item);
      });
    }
    return (
      <Table
        loading={loading.effects['contractContractList/fetchExpired']}
        dataSource={data}
        columns={this.columns}
      />
    );
  }
}

export default TableList;
