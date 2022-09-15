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

const ShanshanUpdateForm = Form.create()(props => {
  const { form, record } = props;
  const { getFieldDecorator } = form;

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label={<span>skuCode</span>}>
        {getFieldDecorator('sku_code', {
          initialValue: record.tips,
        })(
          <Select allowClear showArrow style={{ width: '100%' }}>
            <Select.Option value="1">条码</Select.Option>
            <Select.Option value="0">物料号</Select.Option>
          </Select>,
        )}
      </Form.Item>
    </Fragment>
  );
});

export default ShanshanUpdateForm;
