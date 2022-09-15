import React, { useState, Fragment } from 'react';
import { Form, Input, Button, Select, Icon, Row, Col, InputNumber } from 'antd';
import { routerRedux } from 'dva/router';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};

const ButtonGroup = Button.Group;

const PieForm = Form.create()(props => {
  const { form, dispatch, record } = props;
  const { getFieldDecorator, getFieldValue } = form;

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="showRoseType">
        {getFieldDecorator('showRoseType', {
          initialValue: record.showRoseType,
          rules: [],
        })(
          <Select allowClear showArrow style={{ width: 200 }}>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="showTotal">
        {getFieldDecorator('showTotal', {
          initialValue: record.showTotal,
          rules: [],
        })(
          <Select allowClear showArrow style={{ width: 200 }}>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="radius">
        {getFieldDecorator('radius', {
          initialValue: record.radius,
          rules: [],
        })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="borderRadius">
        {getFieldDecorator('borderRadius', {
          initialValue: record.borderRadius,
          rules: [],
        })(<InputNumber />)}
      </Form.Item>
    </Fragment>
  );
});

export default PieForm;
