import React, {useState, Fragment } from 'react';
import { Form, Select, Input } from 'antd';
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

const DetailForm = Form.create()(props => {
  const { form, record, dispatch, shops, brands, auth_list, companies } = props;
  const { getFieldDecorator } = form;
  const info = record.auth && record.auth === 'shop' ? shops : (record.auth && record.auth === 'brand' ? brands : (record.auth && record.auth === 'company' ? companies : []))
  const [items, setItems] = useState(info);
  const [type, setType] = useState(record.auth || 'developer');

  const onChange = e => {
      setType(e);
      if ( e === 'company'){
        setItems(companies)
      } else if ( e === 'shop'){
        setItems(shops)
      } else if ( e === 'brand'){
        setItems(brands)
      } else {
        setItems([])
      }
  }

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="姓名">
          {getFieldDecorator('name', {
            initialValue: record.name,
            rules: [
                {
                required: true,
                message: '请填写姓名',
                },
            ],
          })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="权限类型">
          {getFieldDecorator('auth', {
            initialValue: record.auth,
            rules: [
                {
                required: true,
                message: '请选择权限类型',
                },
            ],
          })(
            <Select showArrow style={{ width: '100%' }} onChange={onChange}>
              {auth_list.map(item => (
                <Select.Option key={item.name} value={item.value}>
                    {item.name}
                </Select.Option>
              ))}
            </Select>,
            // <Select showArrow style={{ width: '100%' }} onChange={onChange}>
            //   <Select.Option value="developer">高级管理员</Select.Option>
            //   <Select.Option value="company">集团管理员</Select.Option>
            //   <Select.Option value="shop">门店管理员</Select.Option>
            //   <Select.Option value="brand">品牌管理员</Select.Option>
            // </Select>,
          )}
      </Form.Item>
      {type !== 'developer' && type !== 'admin' && ( <Form.Item {...formItemLayout} label="权限范围">
        {getFieldDecorator('target_sid', {
          initialValue: record.target_sid,
          rules: [
            {
                required: true,
                message: '请选择权限范围',
            },
        ],
        })(
            <Select showArrow showSearch style={{ width: '100%' }}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {items.map(item => (
                <Select.Option key={item.name} value={item.sid} label={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>,
        )}
      </Form.Item>
      )}
    </Fragment>
  );
});

export default DetailForm;
