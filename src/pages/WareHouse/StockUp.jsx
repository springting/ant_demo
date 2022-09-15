/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import { Upload, Button, Card, Divider, Icon, Row, Col, message, Form, Select } from 'antd';
// import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Dragger } = Upload;

const RenderForm = Form.create()(props => {
  const { form, supply_list, brand_list, dispatch } = props;
  const { getFieldDecorator } = form;
  const [filename, setFilename] = useState();
  const uploadChange = info => {
    const name = info.file.name.replace(new RegExp(/( )/g), '_'); // 用于替换所有空格
    setFilename(name);
    const { status } = info.file;
    if (status === 'done') {
      const { response } = info.file;
      if (response.err === 0) {
        message.success(`${info.file.name}上传成功`);
      }
    } else if (status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { sid, bid } = fieldsValue;
      const info = { sid, bid, f: filename, json: 1 };
      dispatch({
        type: 'warehouse/fetchsupplybrand',
        payload: { supply_sid: sid, brand_token: bid },
      });
      dispatch({
        type: 'warehouse/cfgStock',
        payload: info,
      });
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
        <Col md={10} sm={30}>
          <Form.Item label="供应商名称">
            {getFieldDecorator('sid', {
              rules: [
                {
                  required: true,
                  message: '请选择供应商',
                },
              ],
            })(
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                onChange={supply_sid => {
                  dispatch({
                    type: 'global/fetchBrands',
                    payload: { supply_sid },
                  });
                }}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {supply_list.map(item => (
                  <Select.Option key={item.sup_info} value={item.sid} label={item.sup_info}>
                    {item.sup_info}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={6} sm={18}>
          <Form.Item label="品牌">
            {getFieldDecorator('bid', {
              rules: [
                {
                  required: true,
                  message: '请选择品牌',
                },
              ],
            })(
              <Select
                allowClear
                showArrow
                style={{ width: '100%' }}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {brand_list.map(item => (
                  <Select.Option key={item.sid} value={item.sid} label={item.brand_name}>
                    {item.brand_name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Row style={{ padding: '30px 0' }}>
        <Col>
          <Dragger
            name="file"
            action="/xzs-api/uploadFile"
            onChange={uploadChange}
            accept=".xlsx,.xls,.xml"
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <h1>库存 校对/导入</h1>
            <p>
              请上传<strong>"厂商库存xls"</strong>
            </p>
            <p>
              <strong>使用说明：</strong>拖拽文件到空白区域或点击空白区域选择文件上传
            </p>
            <p>(仅支持.xls .xlsx .xml文件)</p>
          </Dragger>
        </Col>
      </Row>
      {filename && (
        <Button type="primary" style={{ float: 'right' }} onClick={okHandle}>
          下一步
          <Icon type="right" />
        </Button>
      )}
    </Form>
  );
});

function StockUp({ dispatch, global }) {
  const { supply_list, brands } = global;

  return (
    <Card>
      <div className={styles.tableListForm}>
        <RenderForm supply_list={supply_list} brand_list={brands} dispatch={dispatch} />
      </div>
    </Card>
  );
}

export default connect(({ warehouse, global }) => ({ warehouse, global }))(StockUp);
