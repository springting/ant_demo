import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Select, Icon, Row, Col, InputNumber } from 'antd';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};

const { TextArea } = Input;

const DetailForm = Form.create()(props => {
  const { form, dispatch, record } = props;
  const { getFieldDecorator, getFieldValue } = form;

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="_id" style={{ display: 'none' }}>
        {getFieldDecorator('_id', {
          initialValue: record._id,
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="name">
        {getFieldDecorator('name', {
          initialValue: record.name,
          rules: [{ required: true }],
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="source">
        {getFieldDecorator('source', {
          initialValue: record.source,
          rules: [{ required: true }],
        })(
          <Select showArrow style={{ width: '100%' }}>
            {['click', 'mysql', 'mongo'].map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="db">
        {getFieldDecorator('db', {
          initialValue: record.db,
          rules: [{ required: true }],
        })(
          <Select showArrow style={{ width: '100%' }}>
            {['anchor_live_schedule', 'bangdan', 'brand_insight'].map(item => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="content">
        {getFieldDecorator('content', {
          initialValue: record.content,
          rules: [{ required: true }],
        })(<TextArea rows={10} />)}
      </Form.Item>
    </Fragment>
  );
});

export default DetailForm;
