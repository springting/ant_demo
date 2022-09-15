import React, {useState, Fragment } from 'react';
import { Form, Select, Input, Upload, Icon, Tooltip, } from 'antd';
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


const LocationForm = Form.create()(props => {
  const { form, record, dispatch } = props;
  const { getFieldDecorator } = form;
  // console.log(record)

  return (
    <Fragment>
       <Form.Item {...formItemLayout} label="楼层/区域">
        {getFieldDecorator('floor_no', {
            initialValue: record.floor_no,
          })(
            <Select showArrow style={{ width: '100%' }}>
              {record.floors.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>,
          )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="柜台号">
        {getFieldDecorator('counter_no', {
            initialValue: record.counter_no,
          })(<Input />)}
      </Form.Item>
    </Fragment>
  );
});

export default LocationForm;
