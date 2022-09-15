/* eslint-disable camelcase */
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Card,  Form, Select, Button, Divider, Row, Col, Upload, Icon } from 'antd';
import styles from './index.less';

const RenderForm = Form.create()(props => {
    const {
      form,
      swiper_ads,
      shops,
      brands,
      dispatch,
    } = props;
    const { getFieldDecorator } = form;

    const swiper_items = swiper_ads && swiper_ads.items ? swiper_ads.items : [[], [], []];
    const [items, setItems] = useState(swiper_items);
    const swipers = swiper_ads && swiper_ads.cover ? swiper_ads.cover : ['', '', ''];
    const [imgList, setImgList] = useState(swipers);

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
        
    const [imgStatus, setImgStatus] = useState([uploadButton, uploadButton, uploadButton]);

    const okHandle = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const { type, value } = fieldsValue;
        const cover = imgList;
        // console.log('cover:', cover, 'type:', type, 'value:', value)
        dispatch({
            type: 'startSetting/update',
            payload: {source: 'swiper', cover, type, value}
        })
      });
    };


    const onChange = (e, index) => {
        let changes = {...items}
        if (e === 'shop'){
            changes[index] = shops;
        } else if (e === 'brand'){
            changes[index] = brands;
        } else {
            changes[index] = []
        }
        setItems(changes)
    };

    const imgChange = (info, index) => {
        let newImgList = imgList.map((item, idx) => item);
        if (info.file.status === "uploading") {
            newImgList[index] = '';
            setImgList(newImgList);
            imgStatus[index] = loadingButton;
            setImgStatus(imgStatus);
            return;
        }
        
        if (info.file.status === "done") {
            newImgList[index] = info.file.response.url;
            setImgList(newImgList)
        }

    };

    const maps = [0, 1, 2];
    const mapItems = maps.map(m => (
        <Row className={styles.StartRow} key={m}>
            <Form.Item key={m}>
                <Col style={{float:'left',width:'22%'}}>
                    {getFieldDecorator(`cover[${m}]`, {
                        rules: [],
                    })(
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            action='/xzs-api/imgupload'
                            onChange={e => imgChange(e, `${m}`)}
                        >
                            {imgList[`${m}`] ? <img src={imgList[`${m}`]} alt="avatar" style={{ width: '100%' }} /> : imgStatus[`${m}`]}
                        </Upload>
                    
                    )}          
                </Col>
                <Col style={{float:'left',width:'10%',marginTop: 25}}>
                    {getFieldDecorator(`type[${m}]`, {
                        initialValue: swiper_ads && swiper_ads.type ? swiper_ads.type[m] : undefined,
                        rules: [],
                    })(
                        <Select
                            showSearch
                            placeholder="选择跳转页面类型" 
                            style={{ width: '100%' }}
                            onChange={ e => onChange(e, `${m}`)}                          
                        >
                            <Select.Option value="shop">项目</Select.Option>
                            <Select.Option value="brand">品牌</Select.Option>
                            <Select.Option value="">其他</Select.Option>
                        </Select>,
                    
                    )}
                </Col>
                <Col style={{float:'left', width:'30%',marginTop: 25, textAlign: 'center'}}>
                    {getFieldDecorator(`value[${m}]`, {
                        initialValue: swiper_ads && swiper_ads.value ? swiper_ads.value[m] : undefined,
                        rules: [],
                    })(
                        <Select 
                            showSearch 
                            showArrow 
                            allowClear
                            placeholder="选择跳转页面详情" 
                            style={{ width: '100%' }}
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {items[`${m}`].map(item => (
                                <Select.Option key={item.name} value={item.sid} label={item.name}>{item.name}</Select.Option>
                            ))}
                        </Select>,
                    )}
                </Col>
            </Form.Item>
        </Row>
      ));

    return (
       <Form>
           <Form.Item>
               {mapItems}
           </Form.Item>
           <Button type="primary" style={{ marginLeft: 16 }} onClick={okHandle}>确定</Button>
       </Form>
           

    );
  });

function SwiperSetting({ startSetting, dispatch, global }) {
  const { swiper_ads } = startSetting;
  const { shop_list, brand_list } = global;

  return (
    <Card>
        <h1>顶部轮播</h1>
        <p>建议图片长宽比为16:8， 上传图片后选择跳转到的项目或品牌</p>
        <Divider />
        <RenderForm
            dispatch={dispatch}
            swiper_ads={swiper_ads}
            shops={shop_list}
            brands={brand_list}
        />


    </Card>
  );
}

export default connect(({ startSetting, loading, global }) => ({
  startSetting,
  loading,
  global,
}))(SwiperSetting);
