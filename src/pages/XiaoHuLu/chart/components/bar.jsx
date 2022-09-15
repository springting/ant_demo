import React, { useState, Fragment } from 'react';
import { Form, Input, Button, Select, Icon, Row, Col, InputNumber } from 'antd';
import { routerRedux } from 'dva/router';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};

const ButtonGroup = Button.Group;

const BarForm = Form.create()(props => {
  const { form, dispatch, record } = props;
  const { getFieldDecorator, getFieldValue } = form;

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="stack">
        {getFieldDecorator('stack', {
          initialValue: record.stack,
          rules: [],
        })(
          <Select allowClear showArrow placeholder="是否堆叠" style={{ width: 200 }}>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="average">
        {getFieldDecorator('average', {
          initialValue: record.average,
          rules: [],
        })(
          <Select allowClear showArrow placeholder="是否展示平均数" style={{ width: 200 }}>
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
      <Form.Item {...formItemLayout} label="showToolBox">
        {getFieldDecorator('showToolBox', {
          initialValue: record.showToolBox,
          rules: [],
        })(
          <Select allowClear showArrow placeholder="是否展示右上角icon" style={{ width: 200 }}>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="direction">
        {getFieldDecorator('direction', {
          initialValue: record.direction,
          rules: [],
        })(<Input placeholder="柱状图方向" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="barWidth">
        {getFieldDecorator('barWidth', {
          initialValue: record.barWidth,
          rules: [],
        })(<InputNumber placeholder="柱子宽度" />)}
      </Form.Item>
    </Fragment>
  );
});

export default BarForm;
