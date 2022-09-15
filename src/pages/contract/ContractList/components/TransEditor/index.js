/*
本组件作为自定义表单控件，用于显示deduction_rate编辑界面。（可接受getFieldDecorator的装饰）
*/
import React, { PureComponent, Fragment } from 'react';
import { DatePicker, Radio, InputNumber, Divider, message } from 'antd';
import TransList from './TransList';
import styles from './index.less';

const { RangePicker } = DatePicker;

const initiateState = () => {
  return {
    // 待添加数据
    oldValue: [],
    dateRange: [],
    rateType: undefined, // 二选一：  "base_dr"  or "cpm"
    rateValue: undefined, // base_dr 对应浮点数字符串，cpm对应cost
    clear: 0,
    bd: 0,
    ladderMode: undefined, // undifined 或 三选一  "ladder_v", "discount_ori", "clear_cnt"
    ladderValue: 0, // 如果ladderMode有值，则该项必有值且为ladder_dr的值
    ladderModeArg: undefined, // 如果ladderModel有值，则该项必有值，且为对应Mode的值
  };
};

export default class TransEditor extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || ''),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const { value } = this.props;
    const oldValue = [];
    if (value) {
      value
        .replace(/'/g, '"')
        .split('|')
        .forEach(elm => {
          oldValue.push(JSON.parse(elm));
        });
    }
    this.state = { ...initiateState(), oldValue };
    // if(props.onChange)props.onChange([...oldValue]);
  }

  handleDateChange = _date => {
    this.setState({ dateRange: _date });
  };

  handleRateTypeChange = e => {
    const { rateType } = this.state;
    const newType = e.target.value;
    if (rateType !== newType) {
      // change of type
      if (newType === 'cpm') {
        this.setState({ rateType: newType });
      }
      if (newType === 'base_dr') {
        this.setState({ rateType: newType });
      }
    }
  };

  handleRateValueChange = value => {
    this.setState({ rateValue: value });
  };

  handleLadderModeChange = e => {
    this.setState({ ladderMode: e.target.value });
  };

  handleLadderValueChange = value => {
    this.setState({ ladderValue: value });
  };

  handleLadderModeArgChange = value => {
    this.setState({ ladderModeArg: value });
  };

  addRule = () => {
    const {
      oldValue,
      dateRange,
      rateType,
      rateValue,
      clear,
      bd,
      ladderMode,
      ladderValue,
      ladderModeArg,
    } = this.state;
    const { onChange } = this.props;
    if (dateRange.length !== 2) {
      return message.error('请选择规则有效时段。');
    }
    if (!rateType) {
      return message.error('请选择费率模式。');
    }
    if (rateType === 'cpm') {
      // cpm 没有额外联动选项，可以直接提交了。
      const rate = {
        start: dateRange[0].format('YYYYMMDD'),
        end: dateRange[1].format('YYYYMMDD'),
        cpm: 'cost',
        bd: bd || 0,
        clear: clear || 0,
      };
      this.setState({ ...initiateState, oldValue: [...oldValue, rate] });
      onChange([...oldValue, rate].map(e => JSON.stringify(e)).join('|'));
    } else if (rateType === 'base_dr') {
      const rate = {
        start: dateRange[0].format('YYYYMMDD'),
        end: dateRange[1].format('YYYYMMDD'),
        base_dr: rateValue,
        bd: bd || 0,
        clear: clear || 0,
      };
      if (ladderMode && ladderValue && ladderModeArg) {
        // 有阶梯扣费参数
        rate.ladder_dr = ladderValue;
        rate[ladderMode] = ladderModeArg;
      }
      this.setState({ ...initiateState, oldValue: [...oldValue, rate] });
      onChange([...oldValue, rate].map(e => JSON.stringify(e)).join('|'));
    }
    return null;
  };

  removeRule = value => {
    const { onChange } = this.props;
    this.setState({ oldValue: [...value] }, () => {
      onChange([...value].map(e => JSON.stringify(e)).join('|'));
    });
  };

  renderLadder() {
    const { rateType, ladderMode, ladderModeArg, ladderValue } = this.state;
    // 有base_dr时才需要渲染阶梯扣费
    if (rateType === 'base_dr') {
      return (
        <Fragment>
          <Divider orientation="left" style={{ fontSize: '100%', fontWeight: 100 }}>
            阶梯扣费配置(选填)
          </Divider>
          <Radio.Group onChange={this.handleLadderModeChange}>
            <Radio className={styles.radioStyle} value="ladder_v">
              销量额
            </Radio>
            <Radio className={styles.radioStyle} value="discount_ori">
              折扣值
            </Radio>
            <Radio className={styles.radioStyle} value="clear_cnt">
              销售量
            </Radio>
          </Radio.Group>
          <br />
          <span>阈值：</span>
          <InputNumber
            disabled={!ladderMode}
            defaultValue={ladderModeArg}
            onChange={this.handleLadderModeArgChange}
          />
          <Divider type="vertical" />
          <span>费率：</span>
          <InputNumber
            disabled={!ladderMode}
            formatter={value => `${(value * 100).toFixed(2)}%`}
            parser={value => (value ? (parseFloat(value.replace(/%/, '')) / 100).toFixed(4) : 0)}
            min={0}
            max={1}
            step={0.01}
            style={{ display: 'inline-block' }}
            defaultValue={ladderValue}
            onChange={this.handleLadderValueChange}
          />
        </Fragment>
      );
    }
    return null;
  }

  render() {
    const { oldValue, rateType, rateValue } = this.state;
    return (
      <Fragment>
        <TransList value={oldValue} onChange={this.removeRule} />
        <p>可在下方添加新扣费规则到上方规则列表中</p>
        <span>生效期：</span>
        <RangePicker onChange={this.handleDateChange} />
        <br />
        <span>清算额(选填)：</span>
        <InputNumber onChange={value => this.setState({ clear: value })} />
        <br />
        <span>保底额(选填)：</span>
        <InputNumber onChange={value => this.setState({ bd: value })} />
        <Divider orientation="left" style={{ fontSize: '100%', fontWeight: 100 }}>
          扣费配置(必选)
        </Divider>
        <Radio.Group onChange={this.handleRateTypeChange}>
          <Radio className={styles.radioStyle} value="base_dr">
            基础扣费
            {rateType === 'base_dr' ? (
              <InputNumber
                formatter={value => `${(value * 100).toFixed(2)}%`}
                parser={value =>
                  value ? (parseFloat(value.replace(/%/, '')) / 100).toFixed(4) : 0
                }
                min={0}
                max={1}
                step={0.01}
                style={{ width: 75, marginLeft: 10, display: 'inline-block' }}
                defaultValue={rateValue}
                onChange={this.handleRateValueChange}
              />
            ) : null}
          </Radio>
          <Radio className={styles.radioStyle} value="cpm">
            CPM扣费
            {rateType === 'cpm' ? <span>：cost</span> : null}
          </Radio>
        </Radio.Group>
        {this.renderLadder()}
        <div className={styles.btnStyle} onClick={this.addRule}>
          添加
        </div>
      </Fragment>
    );
  }
}
