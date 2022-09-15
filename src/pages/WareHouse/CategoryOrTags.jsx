/* eslint-disable camelcase */
import React, { Fragment, useState } from 'react';
import { connect } from 'dva';
import { Upload, Button, Card, Divider, Icon, Row, Col, message, Form, Select, Table } from 'antd';
// import { routerRedux } from 'dva/router';
import styles from './style.less';

const { Dragger } = Upload;

const RenderForm = Form.create()(props => {
  const { form, supply_list, brand_list, dispatch, upData } = props;
  const { getFieldDecorator } = form;

  const map_entry = {
    category: { title: '录入品类结构模板', desc: '品类结构模板' },
    tag: { title: '录入标签对照模板', desc: '标签对照模板' },
  };
  const [info, setInfo] = useState(map_entry.category);
  const [filename, setFilename] = useState();

  const uploadChange = info => {
    const { status } = info.file;
    if (status === 'done') {
      const { response } = info.file;
      const file_name = info.file.name.replace(new RegExp(/( )/g), '_');
      if (response.err === 0) {
        message.success(`${file_name}上传成功`);
        setFilename(file_name);
        dispatch({
          type: 'warehouse/upFile',
          payload: { f: file_name, json: 1 },
        });
      }
    } else if (status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  };
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { supply_sid, brand_token, entry } = fieldsValue;
      dispatch({
        type: 'warehouse/fetchsupplybrand',
        payload: { supply_sid, brand_token, entry, f: filename },
      });
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={10} sm={30}>
          <Form.Item label="供应商名称">
            {getFieldDecorator('supply_sid', {
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
            {getFieldDecorator('brand_token', {
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
        <Col md={6} sm={18}>
          <Form.Item label="类型">
            {getFieldDecorator('entry', {
              rules: [{ required: true }],
              initialValue: 'category',
            })(
              <Select
                tyle={{ width: '100%' }}
                onChange={type => {
                  setInfo(map_entry[type]);
                }}
              >
                <Select.Option value="category">品类结构</Select.Option>
                <Select.Option value="tag">标签对照</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Row style={{ padding: '30px 0' }}>
        <Col>
          <Dragger
            showUploadList={false}
            name="file"
            action="/xzs-api/uploadFile"
            onChange={uploadChange}
            accept=".xlsx,.xls,.xml"
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <h1>{info.title}</h1>
            <p>
              请上传<strong>"{info.desc}xls"</strong>
            </p>
            <p>
              <strong>使用说明：</strong>拖拽文件到空白区域或点击空白区域选择文件上传
            </p>
            <p>(仅支持.xls .xlsx .xml文件)</p>
          </Dragger>
        </Col>
      </Row>
      {upData && (
        <Fragment>
          <Row>
            <Button type="primary" block onClick={okHandle}>
              提交{info.desc}
            </Button>
          </Row>
          <Row style={{ padding: '30px 0' }}>
            <Table
              columns={upData[0].map((col, idx) => ({ title: col, dataIndex: idx, key: idx }))}
              dataSource={upData.slice(1)}
              pagination={false}
            />
          </Row>
        </Fragment>
      )}
    </Form>
  );
});

function Category({ warehouse, dispatch, global }) {
  const { supply_list, brands } = global;
  const { sbc, upData } = warehouse;
  return (
    <Card>
      <div className={styles.tableListForm}>
        <RenderForm
          supply_list={supply_list}
          brand_list={brands}
          dispatch={dispatch}
          sbc={sbc}
          upData={upData}
        />
      </div>
    </Card>
  );
}

export default connect(({ warehouse, global }) => ({ warehouse, global }))(Category);
