/*
本组件作为自定义表单控件，用于显示deduction_rate编辑界面。（可接受getFieldDecorator的装饰）
*/
import React, { PureComponent } from 'react';
import { List, Icon, Tooltip } from 'antd';
import moment from 'moment';
// import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import styles from './index.less';

const isFutureTime = t => {
  return moment(t, 'YYYYMMDD').isAfter(moment());
};

export default class UpdateForm extends PureComponent {
  // 接受初始化参数 value
  // value格式是json列表： [{start:"20190601", end:"20190602", base_dr: "0.08", ...}, ...]

  deleteItem = item => {
    const { value, onChange } = this.props;
    const newValue = value.filter(elm => elm !== item);
    if (onChange) {
      onChange(newValue);
    }
  };

  render() {
    const { value } = this.props;
    return (
      <List
        header={<b>现有扣率规则</b>}
        bordered
        dataSource={value}
        renderItem={item => (
          <List.Item>
            <span>
              {item.start}~{item.end}期间，
              {item.base_dr
                ? `基础扣率为销售额的${(parseFloat(item.base_dr) * 100).toFixed(2)}%`
                : '成本价作为结算单价'}
              {item.bd ? `，保底额${item.bd}元` : ''}
              {item.clear ? `，清算额${item.clear}元` : ''}
              {item.ladder_v
                ? `，${item.ladder_v}作为阶梯额，月结额超过${item.ladder_v}时，扣率为${(
                    parseFloat(item.ladder_dr) * 100
                  ).toFixed(2)}%`
                : ''}
              {item.discount_ori
                ? `，销售折扣(销售价/吊牌价)在${item.discount_ori}以内的部分,扣率为${(
                    parseFloat(item.ladder_dr) * 100
                  ).toFixed(2)}`
                : ''}
              {item.clear_cnt
                ? `，合同期内销售数量超过${item.clear_cnt}时,销售额的${(
                    parseFloat(item.ladder_dr) * 100
                  ).toFixed(2)}作为扣率`
                : ''}
              。
            </span>
            <div className={styles.right_icon}>
              {isFutureTime(item.start) || true ? (
                <Icon
                  type="close-circle"
                  theme="twoTone"
                  twoToneColor="#2593fc"
                  onClick={() => this.deleteItem(item)}
                />
              ) : (
                <Tooltip title="已执行或执行中的规则不可删除">
                  <Icon type="check" style={{ color: '#52c41a' }} />
                </Tooltip>
              )}
            </div>
          </List.Item>
        )}
      />
    );
  }
}
