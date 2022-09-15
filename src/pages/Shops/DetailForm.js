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
  const { form, record, dispatch, companies } = props;
  const { getFieldDecorator } = form;

  const imgList = [];
  const [sid, setSid] = useState(record && record.pics ? record.pics.length : 0)
  if (record && record.pics){      
      for (let i=0; i<record.pics.length;i++){
        imgList.push({'uid': i, 'url': record.pics[i]})
      }
  };
  const [fileList, setFileList] = useState(imgList);
  const [logo, setLogo] = useState(record && record.logo ? record.logo: '');
  const floors = record.floors || [];
  const [changeLog, setChangeLog] = useState({})

  const uploadButton = (
    <div>
        <Icon type="plus" /> 
        <div style={{ marginTop: 8 }}>上传图片</div>
    </div> 
  );

  const logoChange = ({file}) => {
    if (file.status === 'done'){
      setLogo(file.response.url)
      setLogs(file.response.url, 'logo')
    } 
  };

  const handleChange = ({file, fileList}) => {
    if (file.status === "done"){
      fileList[fileList.length-1] = {'uid': sid, 'url': file.response.url};;
      setSid(sid+1);

    }
    setFileList(fileList);
    const pic_items = fileList.map((item) => item.url);
    dispatch({
      type: 'shopstable/savePics',
      payload: { pics: pic_items }
    })
    setLogs(pic_items, 'pics')
  };
  // console.log(pics)


  const setLogs = (value, type) => {
    let newLogs = { ...changeLog };
    newLogs[type] = value;
    setChangeLog(newLogs);
    dispatch({
      type: 'shopstable/saveChangeLogs',
      payload: { logs: newLogs}
    })
  }
  
  const onChange = (e, type) => {
    const { value } = e.target;
    // console.log(value, type)
    setLogs(value, type)
    
  }

  return (
    <Fragment>
       <Form.Item {...formItemLayout} label="门店名称">
        {getFieldDecorator('shop_name', {
            initialValue: record.name,
            rules: [
              {
                required: true,
                message: '请填写门店名称',
              },
            ],
          })(<Input onChange={ e => onChange(e, 'name')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} className={styles.LogoImg} 
        label={
          <span>
            门店Logo图
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
      <Form.Item {...formItemLayout} label="经度">
        {getFieldDecorator('lon', {
          initialValue: record.lon,
          rules: [
            {
              required: true,
              message: '请填写经度',
            },
          ],
        })(<Input  onChange={ e => onChange(e, 'lon')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="纬度">
        {getFieldDecorator('lat', {
          initialValue: record.lat,
          rules: [
            {
              required: true,
              message: '请填写纬度',
            },
          ],
        })(<Input onChange={ e => onChange(e, 'lat')}/>)}

      </Form.Item>
      <Form.Item {...formItemLayout} label="门店地址">
        {getFieldDecorator('address', {
          initialValue: record.address,
          rules: [
            {
              required: true,
              message: '请填写门店地址',
            },
          ],
        })(<Input onChange={ e => onChange(e, 'address')}/>)}
      </Form.Item> 
      <Form.Item {...formItemLayout} label="楼层/区域">
          {getFieldDecorator('floors', {
            initialValue: record.floors,
            rules: [],
          })(
            <Select showArrow mode="tags" style={{ width: '100%' }} onChange={ e => setLogs(e, 'floors')}>
              {floors.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>,
          )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="开业时间">
        {getFieldDecorator('opening_time', {
          initialValue: record.opening_time,
        })(<Input onChange={ e => onChange(e, 'opening_time')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="运营商">
          {getFieldDecorator('company_sid', {
            initialValue: record.company_sid,
            rules: [
              {
                required: true,
                message: '请选择运营商',
              },
            ],
          })(
            <Select 
              showSearch 
              showArrow 
              style={{ width: '100%' }}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={ e => setLogs(e, 'company_sid')}
            >
              {companies.map(item => (
                <Select.Option key={item.name} value={item.sid} label={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>,
          )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="联系电话">
        {getFieldDecorator('tel', {
          initialValue: record.tel,
        })(<Input onChange={ e => onChange(e, 'tel')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="门店简介">
        {getFieldDecorator('description', {
          initialValue: record.description,
        })(<TextArea autoSize={{ minRows: 3, maxRows: 10 }} onChange={ e => onChange(e, 'description')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="商业面积">
        {getFieldDecorator('area', {
          initialValue: record.area,
        })(<Input onChange={ e => onChange(e, 'area')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="营业时间">
        {getFieldDecorator('business_time', {
          initialValue: record.business_time,
        })(<Input onChange={ e => onChange(e, 'business_time')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="店铺数量">
        {getFieldDecorator('stores', {
          initialValue: record.stores,
        })(<Input onChange={ e => onChange(e, 'stores')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="停车位">
        {getFieldDecorator('parking', {
          initialValue: record.parking,
        })(<Input onChange={ e => onChange(e, 'parking')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="公交信息">
        {getFieldDecorator('traffic', {
          initialValue: record.traffic,
        })(<TextArea autoSize={{ minRows: 2, maxRows: 6 }} onChange={ e => onChange(e, 'traffic')}/>)}
      </Form.Item>
      <Form.Item {...formItemLayout} className={styles.PicsImg} 
        label={
          <span>
            图库
            <em className={styles.optional}>
                <Tooltip title="推荐长宽比为16:8，第一张将作为封面图展示。">
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
            fileList={fileList}
            onChange={handleChange}
        >
          {uploadButton}
        </Upload>
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
