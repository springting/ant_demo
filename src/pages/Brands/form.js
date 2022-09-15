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


const DetailForm = Form.create()(props => {
  const { form, record, dispatch, category_list } = props;
  const { getFieldDecorator } = form;
  // console.log(record)
  // console.log(category_list)
  const [logo, setLogo] = useState(record && record.logo ? record.logo: '');
  const uploadButton = (
    <div>
        <Icon type="plus" /> 
        <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
    
  );

  const logoChange = ({file}) => {
    if (file.status === 'done'){
      setLogo(file.response.url)
    } 
  };

  return (
    <Fragment>
       <Form.Item {...formItemLayout} label="品牌名称">
        {getFieldDecorator('brand_name', {
            initialValue: record.name,
            rules: [
              {
                required: true,
                message: '请填写品牌名称',
              },
            ],
          })(<Input />)}
      </Form.Item>
      <Form.Item {...formItemLayout} className={styles.LogoImg} 
        label={
          <span>
            品牌Logo图
            <em className={styles.optional}>
                <Tooltip title="推荐长宽比为1:1">
                  <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                </Tooltip>
            </em>
          </span>
          }
      >
        <Upload
            name="avatar"
            listType="picture-card"
            action='/xzs-api/imgupload'
            onChange={logoChange}
        >
          {logo ? <img src={logo} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>           
      </Form.Item>
      <Form.Item {...formItemLayout} label="品类">
          {getFieldDecorator('category_sid', {
            initialValue: record.category_sid,
          })(
            <Select showArrow mode="tags" style={{ width: '100%' }}>
              {category_list.map(item => (
                <Select.Option key={item.name} value={item.sid.toString()}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>,
          )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="品牌简介">
        {getFieldDecorator('description', {
          initialValue: record.description,
        })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }}/>)}
      </Form.Item>
      <Form.Item style={{display: 'none'}}>
        {getFieldDecorator('logo', {
          initialValue: logo,
        })(<Input />)}
      </Form.Item>
    </Fragment>
  );
});

export default DetailForm;
