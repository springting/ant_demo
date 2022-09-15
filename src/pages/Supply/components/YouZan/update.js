import React, { Fragment } from 'react';
import { Form, Select } from 'antd';

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

const YouzanUpdateForm = Form.create()(props => {
  const { form, record, template_list } = props;
  const { getFieldDecorator } = form;

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label={<span>运费模板</span>}>
        {getFieldDecorator(`template_sid`, {
          initialValue: record.template_sid,
        })(
          <Select
            showSearch
            allowClear
            placeholder="请选择运费模板"
            style={{ width: '100%' }}
            optionFilterProp="label"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {template_list.map(item => (
              <Select.Option key={item.template_name} value={item.sid} label={item.template_name}>
                {item.template_name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>库存扣减方式</span>}>
        {getFieldDecorator('stock_deduct_mode', {
          initialValue: record.stock_deduct_mode,
        })(
          <Select style={{ width: '100%' }}>
            <Select.Option value="0">拍下减库存</Select.Option>
            <Select.Option value="1">付款减库存</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>配送方式</span>}>
        {getFieldDecorator('distribution', {
          initialValue: record.distribution,
        })(
          <Select style={{ width: '100%' }} mode="multiple">
            <Select.Option value="express">快递发货</Select.Option>
            <Select.Option value="city_delivery">同城配送</Select.Option>
            <Select.Option value="self_pick">到店自提</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>开售时间</span>}>
        {getFieldDecorator('sale_time', {
          initialValue: record.sale_time,
        })(
          <Select style={{ width: '100%' }}>
            <Select.Option value="0">立即开售</Select.Option>
            <Select.Option value="1">放入仓库</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>售后服务</span>}>
        {getFieldDecorator('return_msg', {
          initialValue: record.return_msg,
        })(
          <Select style={{ width: '100%' }} mode="multiple">
            <Select.Option value="is_support_barter">支持买家申请换货</Select.Option>
            <Select.Option value="support_unconditional_return">7天无理由退货</Select.Option>
            <Select.Option value="self_refund">自动退款</Select.Option>
          </Select>,
        )}
      </Form.Item>
    </Fragment>
  );
});

export default YouzanUpdateForm;
