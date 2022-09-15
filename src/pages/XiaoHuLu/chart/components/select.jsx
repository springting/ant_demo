import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Select, Icon, Row, Col, InputNumber, Divider } from 'antd';
import { routerRedux } from 'dva/router';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};

const ButtonGroup = Button.Group;

const SelectForm = Form.create()(props => {
  const { form, dispatch, record } = props;
  const { getFieldDecorator, getFieldValue } = form;

  const sid = record.keys ? parseInt(record.keys.slice(-1)) + 1 : 0;
  const [id, setId] = useState(0);
  const [type, setType] = useState(undefined);

  useEffect(() => {
    setId(sid);
    setType(record.type);
  }, [record]);

  const handlerChange = e => {
    // console.log(e, val)
    setType(e.target.value);
  };

  const remove = k => {
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };
  const add = () => {
    const keys = form.getFieldValue('keys');
    setId(id + 1);
    const nextKeys = keys.concat(id);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  getFieldDecorator('keys', { initialValue: record.keys ? record.keys : [] });
  const keys = getFieldValue('keys');
  const formItems = keys.map(k => (
    <Row key={k}>
      <Col span={10}>
        <Form.Item key={k}>
          {getFieldDecorator(`value[${k}]`, {
            initialValue: record.value ? record.value[k] : undefined,
            rules: [],
          })(<Input placeholder="value" />)}
        </Form.Item>
      </Col>
      <Col span={10}>
        <Form.Item key={k}>
          {getFieldDecorator(`label[${k}]`, {
            initialValue: record.label ? record.label[k] : undefined,
            rules: [],
          })(<Input placeholder="label" />)}
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item>
          <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => remove(k)} />
        </Form.Item>
      </Col>
    </Row>
  ));

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="type">
        {getFieldDecorator('type', {
          initialValue: record.type,
          rules: [],
        })(<Input placeholder="选择器类型" onChange={handlerChange} />)}
      </Form.Item>
      {type !== 'TimeSelect' && (
        <div>
          <Form.Item {...formItemLayout} label="key">
            {getFieldDecorator('key', {
              initialValue: record.key,
              rules: [],
            })(<Input />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="default">
            {getFieldDecorator('default', {
              initialValue: record.default,
              rules: [],
            })(<Input placeholder="默认选择选项" />)}
          </Form.Item>
        </div>
      )}
      {type === 'TimeSelect' && (
        <Fragment>
          <Form.Item {...formItemLayout} label="key">
            {getFieldDecorator('key', {
              initialValue: record.key,
              rules: [],
            })(
              <Select showArrow mode="tags" style={{ width: '100%' }}>
                {[].map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="default">
            {getFieldDecorator('default', {
              initialValue: record.default,
              rules: [],
            })(
              <Select showArrow mode="tags" style={{ width: '100%' }}>
                {[].map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="allShow">
            {getFieldDecorator('allShow', {
              initialValue: record.allShow,
              rules: [],
            })(
              <Select allowClear showArrow style={{ width: '100%' }}>
                <Select.Option value={true}>是</Select.Option>
                <Select.Option value={false}>否</Select.Option>
              </Select>,
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="eventType">
            {getFieldDecorator('eventType', {
              initialValue: record.eventType,
              rules: [],
            })(<Input />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="originYear">
            {getFieldDecorator('originYear', {
              initialValue: record.originYear,
              rules: [],
            })(<InputNumber />)}
          </Form.Item>
        </Fragment>
      )}
      <Form.Item {...formItemLayout} label="span">
        {getFieldDecorator('span', {
          initialValue: record.span,
          rules: [],
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="option">
        {formItems}
        <Button span={24} type="dashed" onClick={add}>
          <Icon type="plus" /> 添加
        </Button>
      </Form.Item>
    </Fragment>
  );
});

export default SelectForm;
