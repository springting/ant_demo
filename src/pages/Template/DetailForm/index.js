/* eslint-disable camelcase */
import React, { useState, Fragment } from 'react';
import { routerRedux } from 'dva/router';
import {
  Radio,
  InputNumber,
  Tooltip,
  Button,
  Divider,
  Form,
  Input,
  Select,
  Icon,
  Row,
  message,
  Upload,
  Table,
} from 'antd';
import styles from './index.less';

const InputGroup = Input.Group;
const ButtonGroup = Button.Group;
const { Dragger } = Upload;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const DetailForm = Form.create()(props => {
  const { form, submitData, datacol, upData, editingdetail, sbs, dispatch } = props;
  const { getFieldDecorator, getFieldValue } = form;
  const edit_detail = editingdetail || sbs;
  const [formInfo, setFormInfo] = useState(edit_detail);
  const record_initial = editingdetail ? editingdetail.name : {};
  const [record, setRecord] = useState(record_initial);
  const [value, setValue] = useState();
  const [buttonvalue, setValuebu] = useState('name');
  const id_count =
    editingdetail && editingdetail.name && editingdetail.name.keys
      ? parseInt(editingdetail.name.keys.slice(-1)) + 1
      : 0;
  const [id, setId] = useState(id_count);
  const mid_count =
    editingdetail && editingdetail.name && editingdetail.name.maps
      ? parseInt(editingdetail.name.maps.slice(-1)) + 1
      : 0;
  const [mid, setMid] = useState(mid_count);
  const show_id =
    editingdetail && editingdetail.name && editingdetail.name.shows ? editingdetail.name.shows : [];
  const [show, setShow] = useState(show_id);

  const onChange = e => {
    setValue(e.target.value);
  };

  const radioChange = e => {
    dispatch({ type: 'templatetable/clear' });
    setValuebu(e.target.value);
    const id_now =
      editingdetail && editingdetail[e.target.value] && editingdetail[e.target.value].keys
        ? parseInt(editingdetail[e.target.value].keys.slice(-1)) + 1
        : 0;
    // console.log(id_now)
    setId(id_now);
    const mid_now =
      editingdetail && editingdetail[e.target.value] && editingdetail[e.target.value].maps
        ? parseInt(editingdetail[e.target.value].maps.slice(-1)) + 1
        : 0;
    setMid(mid_now);
    const show_now =
      formInfo[e.target.value] && formInfo[e.target.value].shows
        ? formInfo[e.target.value].shows
        : [];
    setShow(show_now);
    const rainfo = {};
    form.validateFields((err, radioValue) => {
      if (err) return;
      Object.keys(radioValue).forEach(k => {
        if (['supply_sid', 'brand_token'].includes(k)) {
          formInfo[k] = radioValue[k];
          setFormInfo(formInfo);
        } else if (
          ['size_idxfile', 'sizefile', 'colorfile'].includes(k) &&
          radioValue[k] !== undefined
        ) {
          rainfo[k] = upData || radioValue[k];
        } else if (radioValue[k] !== undefined && radioValue[k].length !== 0) {
          rainfo[k] = radioValue[k];
          rainfo.shows = show;
        }
      });
      formInfo[radioValue['radio-button']] = rainfo;
      setFormInfo(formInfo);
      form.resetFields();
    });
    const re = formInfo[e.target.value];
    setRecord(re);
    setValue();
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const rainfo = {};
      Object.keys(fieldsValue).forEach(k => {
        if (['size_idxfile', 'sizefile', 'colorfile'].includes(k) && fieldsValue[k] !== undefined) {
          rainfo[k] = upData || fieldsValue[k];
        } else if (
          k !== 'supply_sid' &&
          k !== 'brand_token' &&
          fieldsValue[k] !== undefined &&
          fieldsValue[k].length !== 0
        ) {
          rainfo[k] = fieldsValue[k];
          rainfo.shows = show;
        }
      });
      formInfo[fieldsValue['radio-button']] = rainfo;
      setFormInfo(formInfo);
      submitData(formInfo);
      // form.resetFields();
    });
  };

  const onCancel = () => {
    dispatch({ type: 'templatetable/clear' });
    dispatch(
      routerRedux.push({
        pathname: '/setting/template/list',
      }),
    );
  };

  const uploadChange = info => {
    const { status } = info.file;
    if (status === 'done') {
      const { response } = info.file;
      if (response.err === 0) {
        message.success(`${info.file.name}上传成功`);
        const { filename } = response;
        dispatch({
          type: 'templatetable/filePreview',
          payload: { f: filename },
        });
      }
    } else if (status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  };
  const record_radio = record ? record.radio : undefined;

  const remove_map = m => {
    const maps = form.getFieldValue('maps');
    if (maps.length === 0) {
      return;
    }
    form.setFieldsValue({
      maps: maps.filter(map => map !== m),
    });
  };
  const add_map = () => {
    const maps = form.getFieldValue('maps');

    setMid(mid + 1);
    const nextKeys = maps.concat(mid);
    form.setFieldsValue({
      maps: nextKeys,
    });
  };
  getFieldDecorator('maps', { initialValue: record && record.maps ? record.maps : [] });
  const maps = getFieldValue('maps');
  const mapItems = maps.map(m => (
    <Row key={m.mid}>
      <InputGroup compact>
        <Form.Item key={m}>
          {getFieldDecorator(`map_key[${m}]`, {
            initialValue: record && record.map_key ? record.map_key[m] : undefined,
            rules: [],
          })(<Input placeholder="key" style={{ width: 200 }} />)}
          {getFieldDecorator(`map_val[${m}]`, {
            initialValue: record && record.map_val ? record.map_val[m] : undefined,
            rules: [],
          })(<Input placeholder="value" style={{ width: 200 }} />)}
        </Form.Item>
        <Form.Item>
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => remove_map(m)}
          />
        </Form.Item>
      </InputGroup>
    </Row>
  ));

  const decrease = k => {
    const keys = form.getFieldValue('keys');
    if (keys.length === 0) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };
  const increase = () => {
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id);
    form.setFieldsValue({
      keys: nextKeys,
    });
    setId(id + 1);
    show[id] = 0;
  };
  const more = k => {
    show[k] = 1;
    setShow(JSON.parse(JSON.stringify(show)));
  };

  getFieldDecorator('keys', { initialValue: record && record.keys ? record.keys : [] });
  const keys = getFieldValue('keys');
  const colItems = keys.map(k => (
    <Row key={k.id}>
      <InputGroup compact>
        <Form.Item key={k}>
          {getFieldDecorator(`col[${k}]`, {
            initialValue: record && record.col ? record.col[k] : undefined,
            rules: [],
          })(
            <Select showArrow placeholder="列名" mode="tags" style={{ width: 200 }}>
              {datacol.map(item => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>,
          )}
          {getFieldDecorator(`start[${k}]`, {
            initialValue: record && record.start ? record.start[k] : undefined,
          })(<InputNumber placeholder="截取开始" />)}
          {getFieldDecorator(`end[${k}]`, {
            initialValue: record && record.end ? record.end[k] : undefined,
            rules: [],
          })(<InputNumber placeholder="截取结束" />)}
          {!(
            show[k] === 1 ||
            (record && record.break && record.break[k]) ||
            (record && record.contains && record.contains[k])
          ) && (
            <Button onClick={() => more(k)}>
              <Icon type="more" />
            </Button>
          )}
          {(show[k] === 1 ||
            (record && record.break && record.break[k]) ||
            (record && record.contains && record.contains[k])) && (
            <Fragment>
              {getFieldDecorator(`break[${k}]`, {
                initialValue: record && record.break ? record.break[k] : undefined,
              })(<Input placeholder="分割符" style={{ width: 100 }} />)}
              {getFieldDecorator(`break_col[${k}]`, {
                initialValue: record && record.break_col ? record.break_col[k] : undefined,
              })(
                <Select allowClear showArrow placeholder="分割列" style={{ width: 100 }}>
                  <Select.Option value="0">前</Select.Option>
                  <Select.Option value="-1">后</Select.Option>
                </Select>,
              )}
              {getFieldDecorator(`contains[${k}]`, {
                initialValue: record && record.contains ? record.contains[k] : undefined,
              })(<Input placeholder="contains" style={{ width: 250 }} />)}
              {getFieldDecorator(`default[${k}]`, {
                initialValue: record && record.default ? record.default[k] : undefined,
              })(<Input placeholder="default" style={{ width: 100 }} />)}
              {getFieldDecorator(`contrast[${k}]`, {
                initialValue: record && record.contrast ? record.contrast[k] : undefined,
              })(<Input placeholder="对照" style={{ width: 250 }} />)}
            </Fragment>
          )}
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => decrease(k)}
          />
        </Form.Item>
      </InputGroup>
    </Row>
  ));

  const clearFile = e => {
    console.log(e);
    const { [e]: _, ...new_record } = record;
    console.log(new_record);
    setRecord(new_record);
  };

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="属性">
        {getFieldDecorator('radio-button', {
          initialValue: 'name',
        })(
          <Radio.Group buttonStyle="solid" onChange={radioChange}>
            <Radio.Button
              value="name"
              style={{
                background:
                  formInfo.name &&
                  ((formInfo.name.col &&
                    formInfo.name.col.toString().replace(',', '').length > 0) ||
                    formInfo.name.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              商品名称
            </Radio.Button>
            <Radio.Button
              value="sku"
              style={{
                background:
                  formInfo.sku &&
                  ((formInfo.sku.col && formInfo.sku.col.toString().replace(',', '').length > 0) ||
                    formInfo.sku.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              款号*
            </Radio.Button>
            <Radio.Button
              value="stock"
              style={{
                background:
                  formInfo.stock &&
                  ((formInfo.stock.col &&
                    formInfo.stock.col.toString().replace(',', '').length > 0) ||
                    formInfo.stock.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              数量*
            </Radio.Button>
            <Radio.Button
              value="color"
              style={{
                background:
                  formInfo.color &&
                  ((formInfo.color.col &&
                    formInfo.color.col.toString().replace(',', '').length > 0) ||
                    formInfo.color.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              颜色*
            </Radio.Button>
            <Radio.Button
              value="size"
              style={{
                background:
                  formInfo.size &&
                  ((formInfo.size.col &&
                    formInfo.size.col.toString().replace(',', '').length > 0) ||
                    formInfo.size.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              尺码*
            </Radio.Button>
            <Radio.Button
              value="size_idx"
              style={{
                background:
                  formInfo.size_idx && (formInfo.size_idx.size_idxfile || formInfo.size_idx.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              <em className={styles.optional}>
                <Tooltip
                  placement="topLeft"
                  title={<span>用于配置横版尺码，无需配置数量和尺码项</span>}
                >
                  尺码标识
                </Tooltip>
              </em>
            </Radio.Button>
            <Radio.Button
              value="price_ori"
              style={{
                background:
                  formInfo.price_ori &&
                  ((formInfo.price_ori.col &&
                    formInfo.price_ori.col.toString().replace(',', '').length > 0) ||
                    formInfo.price_ori.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              吊牌价*
            </Radio.Button>
            <Radio.Button
              value="price_cur"
              style={{
                background:
                  formInfo.price_cur &&
                  ((formInfo.price_cur.col &&
                    formInfo.price_cur.col.toString().replace(',', '').length > 0) ||
                    formInfo.price_cur.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              销售价*
            </Radio.Button>
            <Radio.Button
              value="year"
              style={{
                background:
                  formInfo.year &&
                  ((formInfo.year.col &&
                    formInfo.year.col.toString().replace(',', '').length > 0) ||
                    formInfo.year.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              年份
            </Radio.Button>
            <Radio.Button
              value="season"
              style={{
                background:
                  formInfo.season &&
                  ((formInfo.season.col &&
                    formInfo.season.col.toString().replace(',', '').length > 0) ||
                    formInfo.season.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              季节
            </Radio.Button>
            <Radio.Button
              value="sex"
              style={{
                background:
                  formInfo.sex &&
                  ((formInfo.sex.col && formInfo.sex.col.toString().replace(',', '').length > 0) ||
                    formInfo.sex.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              性别
            </Radio.Button>
            <Radio.Button
              value="discount"
              style={{
                background:
                  formInfo.discount &&
                  ((formInfo.discount.col &&
                    formInfo.discount.col.toString().replace(',', '').length > 0) ||
                    formInfo.discount.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              <em className={styles.optional}>
                <Tooltip placement="bottomLeft" title={<span>配置折扣则无需配置销售价</span>}>
                  折扣
                </Tooltip>
              </em>
            </Radio.Button>
            <Radio.Button
              value="barcode"
              style={{
                background:
                  formInfo.barcode &&
                  ((formInfo.barcode.col &&
                    formInfo.barcode.col.toString().replace(',', '').length > 0) ||
                    formInfo.barcode.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              条码
            </Radio.Button>
            <Radio.Button
              value="extra"
              style={{
                background:
                  formInfo.extra &&
                  ((formInfo.extra.col &&
                    formInfo.extra.col.toString().replace(',', '').length > 0) ||
                    formInfo.extra.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              其他
            </Radio.Button>
            <Radio.Button
              value="sku_code"
              style={{
                background:
                  formInfo.sku_code &&
                  ((formInfo.sku_code.col &&
                    formInfo.sku_code.col.toString().replace(',', '').length > 0) ||
                    formInfo.sku_code.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              外部SKU代码
            </Radio.Button>
            <Radio.Button
              value="color_code"
              style={{
                background:
                  formInfo.color_code &&
                  ((formInfo.color_code.col &&
                    formInfo.color_code.col.toString().replace(',', '').length > 0) ||
                    formInfo.color_code.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              外部颜色代码
            </Radio.Button>
            <Radio.Button
              value="size_code"
              style={{
                background:
                  formInfo.size_code &&
                  ((formInfo.size_code.col &&
                    formInfo.size_code.col.toString().replace(',', '').length > 0) ||
                    formInfo.size_code.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              外部规格代码
            </Radio.Button>
            <Radio.Button
              value="spu_code"
              style={{
                background:
                  formInfo.spu_code &&
                  ((formInfo.spu_code.col &&
                    formInfo.spu_code.col.toString().replace(',', '').length > 0) ||
                    formInfo.spu_code.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              外部SPU代码
            </Radio.Button>
            <Radio.Button
              value="categroy_code"
              style={{
                background:
                  formInfo.categroy_code &&
                  ((formInfo.categroy_code.col &&
                    formInfo.categroy_code.col.toString().replace(',', '').length > 0) ||
                    formInfo.categroy_code.val)
                    ? '#FF6666'
                    : undefined,
              }}
            >
              外部品类代码
            </Radio.Button>
          </Radio.Group>,
        )}
      </Form.Item>
      <Form.Item
        {...formItemLayout}
        label={
          <span>
            配置
            <em className={styles.optional}>
              <Tooltip title={<span>列名与值选择其一进行配置</span>}>
                <Icon type="info-circle-o" style={{ marginRight: 4 }} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {getFieldDecorator('radio', {
          initialValue: record ? record.radio : undefined,
        })(
          <Radio.Group onChange={onChange}>
            <Radio value={1}>列名</Radio>
            <Radio value={2}>值</Radio>
          </Radio.Group>,
        )}
      </Form.Item>
      {(value === 2 || record_radio === 2) && value !== 1 && (
        <Fragment>
          <Form.Item label="值" {...formItemLayout}>
            {getFieldDecorator('val', {
              initialValue: record ? record.val : undefined,
            })(<Input style={{ width: '100%' }} />)}
          </Form.Item>
          {buttonvalue === 'discount' && (
            <Form.Item label="取整方式" {...formItemLayout}>
              {getFieldDecorator('round', {
                initialValue: record && record.round ? record.round : undefined,
              })(
                <Select allowClear showArrow placeholder="取整方式" style={{ width: '100%' }}>
                  <Select.Option value="round">四舍五入</Select.Option>
                  <Select.Option value="ceil">向上取整</Select.Option>
                  <Select.Option value="floor">向下取整</Select.Option>
                </Select>,
              )}
            </Form.Item>
          )}
        </Fragment>
      )}
      {(value === 1 || record_radio === 1) && value !== 2 && (
        <Fragment>
          <Form.Item
            {...formItemLayout}
            label={
              <span>
                列名配置
                <em className={styles.optional}>
                  <Tooltip title={<span>选择属性所对应的列名</span>}>
                    <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                  </Tooltip>
                </em>
              </span>
            }
          >
            {colItems}
            <Button span={24} type="dashed" onClick={increase}>
              <Icon type="plus" /> 添加列名配置
            </Button>
          </Form.Item>
          {['price_ori', 'price_cur', 'discount'].includes(buttonvalue) && (
            <Form.Item label="取整方式" {...formItemLayout}>
              {getFieldDecorator('round', {
                initialValue: record && record.round ? record.round : undefined,
              })(
                <Select allowClear showArrow placeholder="取整方式" style={{ width: '100%' }}>
                  <Select.Option value="round">四舍五入</Select.Option>
                  <Select.Option value="ceil">向上取整</Select.Option>
                  <Select.Option value="floor">向下取整</Select.Option>
                </Select>,
              )}
            </Form.Item>
          )}
          {['name', 'sku', 'season', 'year', 'sex', 'discount', 'extra'].includes(buttonvalue) && (
            <Form.Item
              label={
                <span>
                  映射表
                  <em className={styles.optional}>
                    <Tooltip title={<span>用于配置复杂的列名规则</span>}>
                      <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
              {...formItemLayout}
            >
              {mapItems}
              <Button span={24} type="dashed" onClick={add_map}>
                <Icon type="plus" /> 添加映射表
              </Button>
            </Form.Item>
          )}
        </Fragment>
      )}
      {(value === 1 || record_radio === 1) && value !== 2 && buttonvalue === 'size_idx' && (
        <Fragment>
          <Form.Item label="示例模板下载" {...formItemLayout}>
            <a key="demo" href="/ana-api/static/demo/横版尺码模板.xlsx">
              横版尺码模板
            </a>
          </Form.Item>
          <Form.Item label="尺码文档" {...formItemLayout} hasFeedback>
            {getFieldDecorator('size_idxfile', {
              initialValue: record && record.size_idxfile ? record.size_idxfile : undefined,
            })(
              <Dragger
                name="file"
                action="/ana-api/duizhang"
                onChange={uploadChange}
                accept=".xlsx,.xls,.csv"
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖动到此处上传</p>
                <p className="ant-upload-hint">上传尺码文件。</p>
              </Dragger>,
            )}
          </Form.Item>
          {record && record.size_idxfile && (
            <Fragment>
              <Button
                type="primary"
                size="small"
                style={{ marginLeft: '100px' }}
                onClick={() => clearFile('size_idxfile')}
              >
                {' '}
                清空尺码文档
              </Button>
              <Row
                style={{
                  padding: '10px 0',
                  margin: '0 auto',
                  display: 'block',
                  width: '80%',
                  overflowX: 'scroll',
                }}
              >
                <Table
                  columns={record.size_idxfile[0].map((col, idx) => ({
                    title: col,
                    dataIndex: idx,
                    key: idx,
                  }))}
                  dataSource={record.size_idxfile.slice(1)}
                  pagination={false}
                  size="small"
                />
              </Row>
            </Fragment>
          )}
        </Fragment>
      )}
      {(value === 1 || record_radio === 1) && value !== 2 && buttonvalue === 'color' && (
        <Fragment>
          <Form.Item label="示例模板下载" {...formItemLayout}>
            <a key="demo" href="/ana-api/static/demo/颜色对照模板.xlsx">
              颜色对照模板
            </a>
          </Form.Item>
          <Form.Item label="颜色对照模板" {...formItemLayout} hasFeedback>
            {getFieldDecorator('colorfile', {
              initialValue: record && record.colorfile ? record.colorfile : undefined,
            })(
              <Dragger
                name="file"
                action="/ana-api/duizhang"
                onChange={uploadChange}
                accept=".xlsx,.xls,.csv"
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖动到此处上传</p>
                <p className="ant-upload-hint">上传颜色对照模板。</p>
              </Dragger>,
            )}
          </Form.Item>
          {record && record.colorfile && (
            <Fragment>
              <Button
                type="primary"
                size="small"
                style={{ marginLeft: '100px' }}
                onClick={() => clearFile('colorfile')}
              >
                {' '}
                清空颜色对照
              </Button>
              <Row
                style={{
                  padding: '10px 0',
                  margin: '0 auto',
                  display: 'block',
                  width: '80%',
                  overflowX: 'scroll',
                }}
              >
                <Table
                  columns={record.colorfile[0].map((col, idx) => ({
                    title: col,
                    dataIndex: idx,
                    key: idx,
                  }))}
                  dataSource={record.colorfile.slice(1)}
                  pagination={false}
                  size="small"
                />
              </Row>
            </Fragment>
          )}
        </Fragment>
      )}
      {(value === 1 || record_radio === 1) && value !== 2 && buttonvalue === 'size' && (
        <Fragment>
          <Form.Item label="示例模板下载" {...formItemLayout}>
            <a key="demo" href="/ana-api/static/demo/尺码对照模板.xlsx">
              尺码对照模板
            </a>
          </Form.Item>
          <Form.Item label="尺码对照模板" {...formItemLayout} hasFeedback>
            {getFieldDecorator('sizefile', {
              initialValue: record && record.sizefile ? record.sizefile : undefined,
            })(
              <Dragger
                name="file"
                action="/ana-api/duizhang"
                onChange={uploadChange}
                accept=".xlsx,.xls,.csv"
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">点击或拖动到此处上传</p>
                <p className="ant-upload-hint">上传尺码对照模板。</p>
              </Dragger>,
            )}
          </Form.Item>
          {record && record.sizefile && (
            <Fragment>
              <Button
                type="primary"
                size="small"
                style={{ marginLeft: '100px' }}
                onClick={() => clearFile('sizefile')}
              >
                {' '}
                清空尺码对照
              </Button>
              <Row
                style={{
                  padding: '10px 0',
                  margin: '0 auto',
                  display: 'block',
                  width: '80%',
                  overflowX: 'scroll',
                }}
              >
                <Table
                  columns={record.sizefile[0].map((col, idx) => ({
                    title: col,
                    dataIndex: idx,
                    key: idx,
                  }))}
                  dataSource={record.sizefile.slice(1)}
                  pagination={false}
                  size="small"
                />
              </Row>
            </Fragment>
          )}
        </Fragment>
      )}
      <Fragment>
        <Divider />
        <ButtonGroup style={{ float: 'right' }}>
          <Button onClick={onCancel}> 取消 </Button>
          <Button type="primary" style={{ marginLeft: 16 }} onClick={okHandle}>
            确定
          </Button>
        </ButtonGroup>
      </Fragment>
    </Fragment>
  );
});

export default DetailForm;
