/* eslint-disable camelcase */
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Card,  Form, Select, Button, Divider, Row, Col, Upload, Icon, Input } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
    },
  };
  

const RenderForm = Form.create()(props => {
    const {
      form,
      dispatch,
      record
    } = props;
    const { getFieldDecorator } = form;
    
    const uploadButton = (
        <div>
            <Icon type="plus" /> 
            <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
        
    );

    const [logo, setLogo] = useState(record && record.pic ? record.pic : '');

    const okHandle = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        console.log(fieldsValue)
        // dispatch({
        //     type: 'Regex/update',
        //     payload: {type: 'aboutUs', data: fieldsValue}
        // })

      });
    };

    const logoChange = ({file}) => {
        if (file.status === 'done'){
          setLogo(file.response.url)
        } 
    };

    return (
       <Form>
            <Form.Item {...formItemLayout} className={styles.LogoImg} label="图片">
                <Upload
                    name="avatar"
                    listType="picture-card"
                    action='/xzs-api/imgupload'
                    onChange={logoChange}
                >
                {logo ? <img src={logo} alt="avatar" style={{ width: '100%' }} /> : (record.pic ? <img src={record.pic} alt="avatar" style={{ width: '100%' }} /> : uploadButton)}
                </Upload>           
            </Form.Item>
           
            <Form.Item {...formItemLayout} label="简介">
                {getFieldDecorator('desc', {
                    initialValue: record.desc,
                })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }}/>)}
            </Form.Item> 
            <Form.Item {...formItemLayout} label="客服电话">
                {getFieldDecorator('mobile', {
                    initialValue: record.mobile,
                })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="客服邮箱">
                {getFieldDecorator('customer_email', {
                    initialValue: record.customer_email,
                })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="商务邮箱">
                {getFieldDecorator('business_email', {
                    initialValue: record.business_email,
                })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="网址">
                {getFieldDecorator('url', {
                    initialValue: record.url,
                })(<Input />)}
            </Form.Item>
            <Form.Item style={{display: 'none'}}>
                {getFieldDecorator('pic', {
                initialValue: logo,
                })(<Input />)}
            </Form.Item>
            <Button type="primary" style={{ float: 'right', marginRight: '40px' }} onClick={okHandle}>确定</Button>
       </Form>
           

    );
  });

function aboutUs({ Regex, dispatch}) {
  const { data } = Regex;

  return (
    <Card>
        <h1>关于我们</h1>
        <Divider />
        <RenderForm
            dispatch={dispatch}
            record={data}
        />
    </Card>
  );
}

export default connect(({ Regex, loading, global }) => ({
  Regex,
  loading,
  global,
}))(aboutUs);
