import React, { useState, Fragment, useEffect } from 'react';
import { Form, Input, Button, Icon, Row, Col, Divider, InputNumber, Select } from 'antd';

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
};

const PageDetailForm = Form.create()(props => {
  const { form, record, charts } = props;
  const { getFieldDecorator, getFieldValue } = form;
  // const record = {keys: [0, 1], name: ['图1', '图2'], span: [12, 12], style: ['{"height":"400px","background":"#fff","padding":"20px","margin":"12px"}', '{"height":"400px","background":"#fff","padding":"20px","margin":"12px"}']};
  const sid =
    record && record.keys && record.keys.length > 0 ? parseInt(record.keys.slice(-1)) + 1 : 0;
  const [id, setId] = useState(0);

  useEffect(() => {
    setId(sid);
  }, [record]);


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
  getFieldDecorator('keys', {
    initialValue: record && record.keys && record.keys.length > 0 ? record.keys : [],
  });
  const keys = getFieldValue('keys');
  const formItems = keys.map(k => (
    <Row key={k}>
      <Col span={22}>
        <Form.Item {...formItemLayout} label="图表">
          {getFieldDecorator(`name[${k}]`, {
            initialValue: record && record.name ? record.name[k] : undefined,
            rules: [],
          })(
          // <Input placeholder="选择图表" />
            <Select showArrow showSearch style={{ width: '100%' }}
            optionFilterProp="label"
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            >
              {charts.map(item => (
                <Select.Option key={item.id} value={item.name} label={item.desc}>
                  {item.desc}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="span">
          {getFieldDecorator(`span[${k}]`, {
            initialValue: record && record.span ? record.span[k] : undefined,
            rules: [],
          })(<InputNumber placeholder="span" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="style">
          {getFieldDecorator(`style[${k}]`, {
            initialValue: record && record.style ? record.style[k] : undefined,
            rules: [],
          })(<Input placeholder="style" />)}
        </Form.Item>
        <Divider />
      </Col>
      <Col span={2}>
        <div style={{ paddingTop: 50 }}>
          <Icon type="close" onClick={() => remove(k)} />
        </div>
      </Col>
    </Row>
  ));

  return (
    <Fragment>
      <Form.Item>{formItems}</Form.Item>
      <Button style={{ marginLeft: 50, marginBottom: 30 }} type="primary" onClick={add}>
        <Icon type="plus" /> 添加一个图表
      </Button>
      <Divider />
    </Fragment>
  );
});

export default PageDetailForm;
