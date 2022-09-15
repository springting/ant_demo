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

const HycUpdateForm = Form.create()(props => {
  const { form, record } = props;
  const { getFieldDecorator } = form;
  const ctoken = localStorage.getItem('ctoken');

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label={<span>appKey</span>}>
        {getFieldDecorator('appKey', {
          rules: [{ required: ctoken === 'szhyc' }],
          initialValue: record.appKey,
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>appSecret</span>}>
        {getFieldDecorator('appSecret', {
          rules: [{ required: ctoken === 'szhyc' }],
          initialValue: record.appSecret,
        })(<Input />)}
      </Form.Item>
    </Fragment>
  );
});

export default HycUpdateForm;
