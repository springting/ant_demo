/* eslint-disable no-param-reassign */
/* eslint-disable compat/compat */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/*
本组件作为自定义表单控件，用于显示deduction_rate编辑界面。（可接受getFieldDecorator的装饰）
*/
import React, { PureComponent, Fragment } from 'react';
import { Select, Divider, Input, Row, Col, Checkbox, Tooltip, Tabs, message } from 'antd';

const { Option } = Select;
const { TabPane } = Tabs;

export default class AdminFeeEditor extends PureComponent {
  constructor(props) {
    super(props);
    const { trans_rate_list, fee_type_list, value } = props;
    const oldValue = JSON.parse(value || '{}');
    // console.log('oldValue:', JSON.stringify(oldValue));
    this.state = {
      showValue: false,
      gn_total_trans: 0,
    };
    this.transMap = {};
    this.feeMap = {};
    const defaultCycleOptions = {
      ZK: 'N',
      cycle: {
        day: ' 一天',
        month: ' 一月',
        '2month': ' 两月',
        '3month': ' 三月',
        '6month': ' 半年',
        '12month': ' 一年',
        one: ' 一次性',
      },
      V: 0,
    };
    fee_type_list.forEach(type => {
      let cycle_regex_json;
      try {
        cycle_regex_json = JSON.parse(type.cycle_regex) || defaultCycleOptions;
      } catch (error) {
        cycle_regex_json = defaultCycleOptions;
      }
      const { ZK, cycle } = cycle_regex_json;
      const fee = { ...type, cycle };
      const oldFee = oldValue[fee.code]; //  接口给的值，有可能没值
      if (fee.name === '刷卡手续费') {
        this.specialKey = fee.code;
        const k = fee.code;
        this.state[k] = oldFee || { ZK: 'Y', cycle: 'month', V: {} };
        const skValue = {};
        const oldSkValue = oldValue[k] && oldValue[k].V ? oldValue[k].V : {};
        trans_rate_list.forEach(trans => {
          skValue[trans.code] = trans.value;
          this.transMap[trans.code] = trans.name;
        });
        this.state[k].V = { ...skValue, ...oldSkValue };
      } else {
        const defaultFee =
          fee.code === 'WYF'
            ? { ZK, cycle: Object.keys(cycle)[0], V: 0, unit: 'yuan' }
            : { ZK, cycle: Object.keys(cycle)[0], V: 0 };
        this.state[fee.code] = { ...defaultFee, ...oldFee };
      }
      this.feeMap[fee.code] = fee;
    });
  }

  updateState = (feeType, key, value) => {
    const { onChange } = this.props;
    const newState = { ...this.state };
    newState[feeType] = newState[feeType] || {};
    newState[feeType][key] = value;
    Object.keys(newState).forEach(k => {
      if (!this.feeMap[k]) {
        delete newState[k];
      }
    });
    this.setState(newState, () => onChange(JSON.stringify(newState)));
  };

  // 根据某一个类型：国际、国内、其他修改对应下面全部的交易值
  updateTransAll = (transParents, value) => {
    const { trans_rate_obj } = this.props;
    if (!this.specialKey) {
      message.error('无刷卡手续费！');
      return;
    }
    trans_rate_obj[transParents].forEach(o => {
      this.updateTrans(this.specialKey, o, value);
    });
    this.setState({ gn_total_trans: value });
  };

  // 单独修改交易值
  updateTrans = (feeType, trans, value) => {
    const transKey = trans.trans_sid;
    const { onChange } = this.props;
    const oldTrans = this.state[feeType];
    oldTrans.V[transKey] = (parseFloat(value) || 0) / 100; // 百分比转小数
    const newState = {};
    newState[feeType] = oldTrans;
    trans.v = parseFloat(value);
    this.setState(newState, () => onChange(JSON.stringify(this.state)));
    if (trans.fee_rate === 1) {
      const all_v = Array.from(new Set(Object.values(newState[feeType].V)));
      const gn_total_trans = all_v.length === 1 ? all_v[0] : '';
      this.setState({ gn_total_trans });
    }
  };

  zqDisplay = (key, feeType) => {
    if (typeof this.zqMap[key] === 'object') {
      return this.zqMap[key][feeType] || '单位';
    }
    return this.zqMap[key];
  };

  render() {
    // const { showValue } = this.state;
    const { trans_rate_obj } = this.props;
    return (
      <Fragment>
        {this.specialKey && <Divider orientation="left">刷卡手续费</Divider>}
        {this.specialKey && (
          <Row>
            <Tabs type="card">
              {Object.keys(trans_rate_obj)
                .filter(o => o !== '其它')
                .filter(o => o !== '其他')
                .map(o => {
                  const obj = trans_rate_obj[o];
                  return (
                    <TabPane tab={o} key={o}>
                      {obj.length > 1 ? (
                        <div>
                          <Input
                            style={{ width: '100%' }}
                            addonBefore="全部"
                            value={this.state.gn_total_trans}
                            addonAfter="%"
                            onChange={e => this.updateTransAll(o, e.target.value)}
                          />
                          <div
                            style={{
                              fontSize: '9px',
                              marginBottom: '10px',
                              color: 'rgba(0, 0, 0, 0.45)',
                            }}
                          >
                            (一键设置下方所有值)
                          </div>
                        </div>
                      ) : (
                        ''
                      )}
                      {obj.map(v => {
                        const displayValue = this.state.gn_total_trans
                          ? { value: this.state[this.specialKey].V[v.trans_sid] * 100 }
                          : { defaultValue: this.state[this.specialKey].V[v.trans_sid] * 100 };
                        return (
                          <Input
                            {...displayValue}
                            key={v.trans_sid}
                            onFocus={() => this.setState({ gn_total_trans: '' })}
                            style={{ width: '50%' }}
                            addonBefore={v.name}
                            addonAfter="%"
                            onChange={e => this.updateTrans(this.specialKey, v, e.target.value)}
                          />
                        );
                      })}
                    </TabPane>
                  );
                })}
            </Tabs>
          </Row>
        )}
        <Divider orientation="left">其他费用</Divider>
        <Row>
          <Col span={6}>费用名称</Col>
          <Col span={3}>账扣</Col>
          <Col span={8}>收费周期</Col>
          <Col span={7}>每次收取金额</Col>
        </Row>
        {Object.keys(this.state).map(key => {
          if (!this.feeMap[key] || key === this.specialKey) {
            return null;
          }
          // const zqItems = this.limitedItem[key] || ['day', 'month', 'one', 'unit'];
          // const defaultZqItem = zqItems.length === 1 ? zqItems[0] : this.state[key].ZQ;
          const fee = this.state[key] || { ZK: 'N', cycle: 'month', V: 0 };
          return (
            <Row key={key}>
              <Col span={6}>{this.feeMap[key].name}</Col>
              <Col span={3}>
                <Tooltip placement="topLeft" title="账扣标志">
                  <Checkbox
                    checked={fee.ZK === 'Y'}
                    onChange={e => this.updateState(key, 'ZK', e.target.checked ? 'Y' : 'N')}
                  />
                </Tooltip>
              </Col>
              <Col span={8}>
                <Select
                  defaultValue={fee.cycle in this.feeMap[key].cycle ? fee.cycle : undefined}
                  onChange={value => this.updateState(key, 'cycle', value)}
                  style={{ width: '100%', fontSize: '80%' }}
                >
                  {Object.keys(this.feeMap[key].cycle).map(cycleKey => (
                    <Option key={cycleKey} value={cycleKey} style={{ fontSize: '80%' }}>
                      {this.feeMap[key].cycle[cycleKey]}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={7}>
                <Input
                  // 服务器单位是分，显示时除100，updateState时*100
                  defaultValue={fee.V / 100}
                  style={{ width: '100%', verticalAlign: 'middle' }}
                  addonAfter={
                    fee.unit ? (
                      <Select
                        style={{ width: 50 }}
                        defaultValue={fee.unit}
                        onChange={v => this.updateState(key, 'unit', v)}
                      >
                        <Option value="yuan">元</Option>
                        <Option value="percent">%</Option>
                      </Select>
                    ) : (
                      '元'
                    )
                  }
                  // type="number"
                  placeholder="金额"
                  onChange={e => this.updateState(key, 'V', e.target.value * 100)}
                />
              </Col>
            </Row>
          );
        })}
      </Fragment>
    );
  }
}
