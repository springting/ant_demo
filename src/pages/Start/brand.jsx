/* eslint-disable camelcase */
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Card,  Form, Select, Button, Divider, Row, Col, Upload, Icon } from 'antd';
import styles from './index.less';

const RenderForm = Form.create()(props => {
    const {
      form,
      dispatch,
      brands,
      brand_ads,
    } = props;
    const { getFieldDecorator } = form;
    const items = brands;
    const brand_imgs = brand_ads && brand_ads.cover ? brand_ads.cover : ['', '', '', '', '', ''];
    const [imgList, setImgList] = useState(brand_imgs);
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
        
    const [imgStatus, setImgStatus] = useState([uploadButton, uploadButton, uploadButton, uploadButton, uploadButton, uploadButton]);

    const okHandle = e => {
      e.preventDefault();
  
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        const { type, value } = fieldsValue;
        const cover = imgList;
        // console.log('cover:', cover, 'value:', value)
        dispatch({
            type: 'startSetting/update',
            payload: {source: 'brand', cover, value}
        })

      });
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

    const maps = [0, 1, 2, 3, 4, 5];
    const mapItems = maps.map(m => (
        <div key={m} className={styles.StartRow} style={{float: 'left',width: '50%', height: 200}}>
            <Form.Item key={m}>
                <Col style={{float:'left',width:'40%'}}>
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
                <Col style={{float:'left', width:'50%',marginTop: 25, textAlign: 'center'}}>
                    {getFieldDecorator(`value[${m}]`, {
                        initialValue: brand_ads && brand_ads.value ? brand_ads.value[m] : undefined,
                        rules: [],
                    })(
                        <Select showSearch showArrow placeholder="选择跳转品牌" style={{ width: '100%'}}
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {items.map(item => (
                                <Select.Option key={item.sid} value={item.sid} label={item.name}>{item.name}</Select.Option>
                            ))}
                        </Select>,
                    )}
                </Col>
            </Form.Item>
        </div>
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

function BrandSetting({ startSetting, dispatch, loading, global }) {
  const { brand_ads } = startSetting;
  const { brand_list } = global;

  return (
    <Card>
        <h1>品牌推荐</h1>
        <p>建议图片长宽比为16:8， 上传图片后选择跳转到的品牌</p>
        <Divider />
        <RenderForm
            dispatch={dispatch}
            brand_ads={brand_ads}
            brands={brand_list}
        />


    </Card>
  );
}

export default connect(({ startSetting, loading, global }) => ({
  startSetting,
  loading,
  global,
}))(BrandSetting);
