import React, { Fragment } from 'react';
import { Form, Button, Select, } from 'antd';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};


const WordForm = Form.create()(props => {
  const { form, record } = props;
  const { getFieldDecorator, getFieldValue } = form;

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="showSlider">
        {getFieldDecorator('showSlider', {
          initialValue: record.showSlider,
          rules: [],
        })(
          <Select allowClear showArrow style={{ width: 200 }}>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="rotation">
        {getFieldDecorator('rotation', {
          initialValue: record.rotation,
          rules: [],
        })(
          <Select allowClear showArrow style={{ width: 200 }}>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="colors">
        {getFieldDecorator('colors', {
          initialValue: record.colors,
          rules: [],
        })(
          <Select showArrow mode="tags" style={{ width: '100%' }}>
            {[].map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </Fragment>
  );
});

export default WordForm;
