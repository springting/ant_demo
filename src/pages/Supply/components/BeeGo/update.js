import React, { Fragment } from 'react';
import { Form, Input } from 'antd';

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

const BeeGoUpdateForm = Form.create()(props => {
  const { form, record } = props;
  const { getFieldDecorator } = form;
  const ctoken = localStorage.getItem('ctoken');

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label={<span>店铺别名</span>}>
        {getFieldDecorator('supply_brand_shop_title', {
          rules: [{ required: ctoken === 'beego' }],
          initialValue: record.supply_brand_shop_title,
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>appKey</span>}>
        {getFieldDecorator('appKey', {
          rules: [{ required: ctoken === 'beego' }],
          initialValue: record.appKey,
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>appSecret</span>}>
        {getFieldDecorator('appSecret', {
          rules: [{ required: ctoken === 'beego' }],
          initialValue: record.appSecret,
        })(<Input />)}
      </Form.Item>
    </Fragment>
  );
});

export default BeeGoUpdateForm;
