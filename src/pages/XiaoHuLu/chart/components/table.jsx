import React, { useState, Fragment, useEffect } from 'react';
import { Form, Input, Button, Select, Icon, Row, Col } from 'antd';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};

const TableForm = Form.create()(props => {
  const { form, record } = props;
  const { getFieldDecorator, getFieldValue } = form;

  const sid = record.columns_keys ? parseInt(record.columns_keys.slice(-1)) + 1 : 0;
  const [id, setId] = useState(0);

  useEffect(() => {
    setId(sid);
  }, [record]);

  const remove = k => {
    const keys = form.getFieldValue('columns_keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      columns_keys: keys.filter(key => key !== k),
    });
  };
  const add = () => {
    const keys = form.getFieldValue('columns_keys');
    setId(id + 1);
    const nextKeys = keys.concat(id);
    form.setFieldsValue({
      columns_keys: nextKeys,
    });
  };
  getFieldDecorator('columns_keys', {
    initialValue: record.columns_keys ? record.columns_keys : [],
  });
  const keys = getFieldValue('columns_keys');
  const formItems = keys.map(k => (
    <Row key={k}>
      <Col span={7}>
        <Form.Item key={k}>
          {getFieldDecorator(`columns_key[${k}]`, {
            initialValue: record.columns_key ? record.columns_key[k] : undefined,
            rules: [],
          })(<Input placeholder="key" />)}
        </Form.Item>
      </Col>
      <Col span={7}>
        <Form.Item key={k}>
          {getFieldDecorator(`columns_dataIndex[${k}]`, {
            initialValue: record.columns_dataIndex ? record.columns_dataIndex[k] : undefined,
            rules: [],
          })(<Input placeholder="dataIndex" />)}
        </Form.Item>
      </Col>
      <Col span={7}>
        <Form.Item key={k}>
          {getFieldDecorator(`columns_title[${k}]`, {
            initialValue: record.columns_title ? record.columns_title[k] : undefined,
            rules: [],
          })(<Input placeholder="title" />)}
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
      <Form.Item {...formItemLayout} label="stripe">
        {getFieldDecorator('stripe', {
          initialValue: record.stripe,
          rules: [],
        })(
          <Select allowClear showArrow style={{ width: 200 }}>
            <Select.Option value={true}>是</Select.Option>
            <Select.Option value={false}>否</Select.Option>
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label="columns">
        {formItems}
        <Button span={24} type="primary" onClick={add}>
          <Icon type="plus" /> 添加
        </Button>
      </Form.Item>
    </Fragment>
  );
});

export default TableForm;
