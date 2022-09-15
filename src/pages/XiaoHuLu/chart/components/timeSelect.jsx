import React, { useState, Fragment } from 'react';
import { Form, Input, Button, Select, Icon, Row, Col, InputNumber } from 'antd';
import { routerRedux } from 'dva/router';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};

const ButtonGroup = Button.Group;

const TimeForm = Form.create()(props => {
  const { form, dispatch, record } = props;
  const { getFieldDecorator, getFieldValue } = form;

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="allShow">
        {getFieldDecorator('allShow', {
          initialValue: record.allShow,
          rules: [],
        })(
          <Select allowClear showArrow style={{ width: 200 }}>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="eventType">
        {getFieldDecorator('eventType', {
          initialValue: record.eventType,
          rules: [],
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="originYear">
        {getFieldDecorator('originYear', {
          initialValue: record.originYear,
          rules: [],
        })(<InputNumber />)}
      </Form.Item>
    </Fragment>
  );
});

export default TimeForm;
