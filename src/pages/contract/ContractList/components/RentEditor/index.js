/*
本组件作为自定义表单控件，用于显示deduction_rate编辑界面。（可接受getFieldDecorator的装饰）
*/
import React, { PureComponent, Fragment } from 'react';
import { Input, Col, Select } from 'antd';
// import styles from './index.less';

export default class RentEditor extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      if (value && typeof value === 'string') {
        return JSON.parse(value);
      }
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      rental: value.rental,
      up: value.up,
      unit: value.unit || 'month',
      cycle: value.cycle || '1month',
    };
  }

  handleChange = newState => {
    // 没有加RangePicker，想使用合同start和end，因为DetailForm做成函数式的不方便传值，所以目前暂时只能在大表单提交时处理
    const { rental, up, unit, cycle } = { ...this.state, ...newState };
    const { onChange } = this.props;
    this.setState(newState);
    if (rental) {
      onChange(JSON.stringify({ rental, up: up || 0, unit, cycle }));
    }
  };

  renderUnit = () => {
    const { unit } = this.state;
    const { area } = this.props;
    return (
      <Select defaultValue={unit} onChange={value => this.setState({ unit: value })}>
        <Select.Option value="month">元/月</Select.Option>
        <Select.Option value="area" disabled={!area}>
          元/m²/月
        </Select.Option>
      </Select>
    );
  };

  render() {
    const { rental, up } = this.state;
    return (
      <Fragment>
        <Col span={15}>
          <Input
            addonBefore="首年"
            addonAfter={this.renderUnit()}
            defaultValue={rental}
            onChange={e => this.handleChange({ rental: e.target.value })}
          />
        </Col>
        <Col span={9}>
          <Input
            addonBefore="年涨幅"
            addonAfter="%"
            defaultValue={parseFloat(up) * 100 || undefined}
            onChange={e => this.handleChange({ up: (parseFloat(e.target.value) / 100).toFixed(2) })}
          />
        </Col>
        <Col span={6}>收租周期：</Col>
        <Col span={12}>
          <Select defaultValue="month" onChange={cycle => this.handleChange({ cycle })}>
            <Select.Option value="month">每月</Select.Option>
            <Select.Option value="2month">两月</Select.Option>
            <Select.Option value="3month">三月</Select.Option>
            <Select.Option value="6month">半年</Select.Option>
            <Select.Option value="12month">一年</Select.Option>
          </Select>
        </Col>
      </Fragment>
    );
  }
}
