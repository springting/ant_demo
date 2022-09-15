/* eslint-disable camelcase */
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Card,  Form, Select, Button, Divider, Row, Col, Upload, Icon, Input, Switch } from 'antd';
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

    const [logo, setLogo] = useState(record && record.meeting_pic ? record.meeting_pic : '');
    const [img, setImg] = useState(record && record.dinner_pic ? record.dinner_pic : '');

    const okHandle = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        console.log(fieldsValue)
        dispatch({
            type: 'Regex/update',
            payload: {type: 'seats', data: fieldsValue}
        })

      });
    };

    const logoChange = (info, type) => {
        if (info.file.status === 'done'){
            if (type === 'meeting'){
                setLogo(info.file.response.url)
            } else {
                setImg(info.file.response.url)
            }
          
        } 
    };

    return (
       <Form>
            <Form.Item {...formItemLayout} label="是否展示峰会座位">
                {getFieldDecorator('meeting_seats', {
                    initialValue: record.meeting_seats,
                })(<Switch defaultChecked={record.meeting_seats ? true : false}/>)}
            </Form.Item>          
            <Form.Item {...formItemLayout} label="小程序展示名称">
                {getFieldDecorator('meeting_name', {
                    initialValue: record.meeting_name,
                })(<Input />)}
            </Form.Item> 
            <Form.Item {...formItemLayout} className={styles.LogoImg} label="峰会座位图">
                <Upload
                    name="avatar"
                    listType="picture-card"
                    action='/xzs-api/imgupload'
                    onChange={e => logoChange(e, 'meeting')}
                >
                {logo ? <img src={logo} alt="avatar" style={{ width: '100%' }} /> : (record.meeting_pic ? <img src={record.meeting_pic} alt="avatar" style={{ width: '100%' }} /> : uploadButton)}
                </Upload>           
            </Form.Item>
            <Form.Item {...formItemLayout} label="是否展示晚宴座位">
                {getFieldDecorator('dinner_seats', {
                    initialValue: record.dinner_seats,
                })(<Switch defaultChecked={record.dinner_seats ? true : false}/>)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="小程序展示名称">
                {getFieldDecorator('dinner_name', {
                    initialValue: record.dinner_name,
                })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} className={styles.LogoImg} label="晚宴座位图">
                <Upload
                    name="avatar"
                    listType="picture-card"
                    action='/xzs-api/imgupload'
                    onChange={e => logoChange(e, 'dinner')}
                >
                {img ? <img src={img} alt="avatar" style={{ width: '100%' }} /> : (record.dinner_pic ? <img src={record.dinner_pic} alt="avatar" style={{ width: '100%' }} /> : uploadButton)}
                </Upload>           
            </Form.Item>
            <Form.Item style={{display: 'none'}}>
                {getFieldDecorator('meeting_pic', {
                initialValue: logo||record.meeting_pic,
                })(<Input />)}
            </Form.Item>
            <Form.Item style={{display: 'none'}}>
                {getFieldDecorator('dinner_pic', {
                initialValue: img||record.dinner_pic,
                })(<Input />)}
            </Form.Item>
            <Button type="primary" style={{ float: 'right', marginRight: '40px' }} onClick={okHandle}>确定</Button>
       </Form>
           

    );
  });

function Seats({ Regex, dispatch}) {
  const { seats } = Regex;

  return (
    <Card>
        <h1>峰会及晚宴座位</h1>
        <Divider />
        <RenderForm
            dispatch={dispatch}
            record={seats}
        />
    </Card>
  );
}

export default connect(({ Regex, loading, global }) => ({
  Regex,
  loading,
  global,
}))(Seats);
