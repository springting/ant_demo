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
    }
  };
  

const RenderForm = Form.create()(props => {
    const {
      form,
      dispatch,
      record
    } = props;
    const { getFieldDecorator } = form;
    
    const logos = record && record.logo ? record.logo : ['', '', ''];
    const [logoList, setLogoList] = useState(logos);
    const imgs = record && record.pic_url ? record.pic_url : ['', '', ''];
    const [imgList, setImgList] = useState(imgs);

    const uploadButton = (
        <div>
            <Icon type="plus" /> 
            <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
        
    );
    const loadingButton = (
        <div>
            <Icon type="loading" /> 
            <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
        
    );

    const okHandle = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const { type, name } = fieldsValue;
        console.log(logoList)
        dispatch({
            type: 'Regex/update',
            payload: {type: 'service', data: {type, name, logo: logoList, pic_url: imgList}}
        })

      });
    };

    const imgChange = (info, index) => {
      let newImgList = imgList.map((item, idx) => item);
      if (info.file.status === "done") {
          newImgList[index] = info.file.response.url;
          setImgList(newImgList)
      }
    };
    const logoChange = (info, index) => {
      let newLogoList = logoList.map((item, idx) => item);
      if (info.file.status === "done") {
          newLogoList[index] = info.file.response.url;
          setLogoList(newLogoList)
      }
    };

    const maps = [0, 1, 2];
    const mapItems = maps.map(m => (
      <Fragment key={m}>
          <Row>
            <Col style={{float: 'left', width: '40%'}}>
              <Form.Item label="类型" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator(`type[${m}]`, {
                    initialValue: record && record.type ? record.type[m] : undefined,
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col style={{float: 'left', width: '40%'}}>
              <Form.Item label="顾问" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator(`name[${m}]`, {
                    initialValue: record && record.name ? record.name[m] : undefined,
                })(<Input />)}
              </Form.Item> 
            </Col>
          </Row>  
          <Row>
            <Col style={{float: 'left', width: '40%'}}>
              <Form.Item className={styles.LogoImg} label="头像" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator(`logo[${m}]`)(
                  <Upload
                      name="avatar"
                      listType="picture-card"
                      action='/xzs-api/imgupload'
                      onChange={e => logoChange(e, `${m}`)}
                  >
                  {logoList[m] ? <img src={logoList[m]} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                )}           
              </Form.Item>
            </Col>
            <Col style={{float: 'left', width: '40%'}}>
              <Form.Item className={styles.LogoImg} label="二维码" labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                {getFieldDecorator(`pic_url[${m}]`)(
                  <Upload
                      name="avatar"
                      listType="picture-card"
                      action='/xzs-api/imgupload'
                      onChange={e => imgChange(e, `${m}`)}
                  >
                    {imgList[m] ? <img src={imgList[m]} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>
                )}           
              </Form.Item>
            </Col>
          </Row>
          <Divider />
       </Fragment>
      ));


    return (
       <Form>
            {mapItems}
            <Button type="primary" style={{ float: 'right', marginRight: '40px' }} onClick={okHandle}>确定</Button>
       </Form>
           

    );
  });

function Service({ Regex, dispatch}) {
  const { service } = Regex;
  //console.log(service)

  return (
    <Card>
        <h1>服务管家</h1>
        <Divider />
        <RenderForm
          dispatch={dispatch}
          record={service}
        />       
    </Card>
  );
}

export default connect(({ Regex, loading, global }) => ({
  Regex,
  loading,
  global,
}))(Service);
