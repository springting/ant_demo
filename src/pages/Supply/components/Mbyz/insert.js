import React, { Fragment } from 'react';
import { Form, InputNumber } from 'antd';

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

const MbyzInsertForm = Form.create()(props => {
  const { form } = props;
  const { getFieldDecorator } = form;
  const ctoken = localStorage.getItem('ctoken');

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label={<span>推广开始时间</span>}>
        {getFieldDecorator('start', {
          rules: [{ required: ctoken === 'flls' }],
          initialValue: 0,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>推广结束时间</span>}>
        {getFieldDecorator('end', {
          rules: [{ required: ctoken === 'flls' }],
          initialValue: 30,
        })(<InputNumber />)}
      </Form.Item>
    </Fragment>
  );
});

export default MbyzInsertForm;
