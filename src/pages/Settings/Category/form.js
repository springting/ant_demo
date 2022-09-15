import React, {useState, Fragment } from 'react';
import { Form, Input, } from 'antd';
import styles from './index.less';

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

const { TextArea } = Input;


const DetailForm = Form.create()(props => {
  const { form, record, dispatch } = props;
  const { getFieldDecorator } = form;
  // console.log(record)

  return (
    <Fragment>
       <Form.Item {...formItemLayout} label="品类名称">
        {getFieldDecorator('name', {
            initialValue: record.name,
            rules: [
                {
                required: true,
                message: '请填写品类名称',
                },
            ],
          })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="标签颜色值">
        {getFieldDecorator('tag_color', {
            initialValue: record.tag_color,
            rules: [
                {
                required: true,
                message: '请填写标签颜色值',
                },
            ],
          })(<Input />)}
      </Form.Item>
    </Fragment>
  );
});

export default DetailForm;
