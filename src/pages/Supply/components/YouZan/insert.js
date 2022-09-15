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

const YouzanInsertForm = Form.create()(props => {
  const { form } = props;
  const { getFieldDecorator } = form;

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label={<span>是否为第三方</span>}>
        {getFieldDecorator('contact', {
          initialValue: 'N',
        })(
          <Select style={{ width: '100%' }}>
            <Select.Option value="N">否</Select.Option>
            <Select.Option value="Y">是</Select.Option>
          </Select>,
        )}
      </Form.Item>
    </Fragment>
  );
});

export default YouzanInsertForm;
