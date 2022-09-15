import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, Select, Icon, Row, Col, InputNumber, Divider, Modal } from 'antd';
import SelectForm from './select';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};

const CommonForm = Form.create()(props => {
  const { form, dispatch, record } = props;
  const { getFieldDecorator, getFieldValue } = form;

  const sid = record.select_keys ? parseInt(record.select_keys.slice(-1)) + 1 : 0;
  const [id, setId] = useState(0);

  const event_id = record.event_keys ? parseInt(record.event_keys.slice(-1)) + 1 : 0;
  const [eid, setEid] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const hideModal = () => setModalVisible(false);
  const [editingdetail, setEditingdatail] = useState([]);
  const [ssid, setSsid] = useState(0);

  const select_items = record.select || [];
  const [selects, setSelects] = useState([]);

  useEffect(() => {
    setId(sid);
    setEid(event_id);
    setSelects(select_items);
  }, [record]);

  const CreateForm = Form.create()(props => {
    const { modalVisible, form, hideModal } = props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        // console.log(fieldsValue)
        var re = [...selects];
        re[ssid] = fieldsValue;
        setSelects(re);
        // console.log(selects)
        hideModal();
      });
    };
    return (
      <Modal
        width={980}
        bodyStyle={{ padding: '32px 20px 48px' }}
        destroyOnClose
        title="select"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={hideModal}
      >
        <SelectForm form={form} record={editingdetail} />
      </Modal>
    );
  });

  const addEvent = () => {
    const keys = form.getFieldValue('event_keys');
    setEid(eid + 1);
    const nextKeys = keys.concat(eid);
    form.setFieldsValue({
      event_keys: nextKeys,
    });
  };

  const removeEvent = k => {
    const keys = form.getFieldValue('event_keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      event_keys: event_keys.filter(key => key !== k),
    });
  };

  getFieldDecorator('event_keys', { initialValue: record.event_keys ? record.event_keys : [] });
  const event_keys = getFieldValue('event_keys');
  const eventItems = event_keys.map(k => (
    <Row key={k}>
      <Col span={20} style={{ paddingTop: '10px' }}>
        <Form.Item {...formItemLayout} label="type">
          {getFieldDecorator(`event_type[${k}]`, {
            initialValue: record.event_type ? record.event_type[k] : undefined,
            rules: [],
          })(<Input placeholder="event_type" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="value">
          {getFieldDecorator(`event_value[${k}]`, {
            initialValue: record.event_value ? record.event_value[k] : undefined,
            rules: [],
          })(<Input placeholder="event_value" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="key">
          {getFieldDecorator(`event_key[${k}]`, {
            initialValue: record.event_key ? record.event_key[k] : undefined,
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
          {getFieldDecorator(`event_default[${k}]`, {
            initialValue: record.event_default ? record.event_default[k] : undefined,
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
      </Col>
      <Col span={3}>
        <div style={{ paddingTop: 100, paddingLeft: 30 }}>
          <Icon type="close" onClick={() => removeEvent(k)} />
        </div>
      </Col>
      <Divider />
    </Row>
  ));

  const remove = k => {
    const keys = form.getFieldValue('select_keys');
    if (keys.length === 1) {
      return;
    }

    form.setFieldsValue({
      select_keys: keys.filter(key => key !== k),
    });
  };
  const addSelect = () => {
    // setModalVisible(true)
    const keys = form.getFieldValue('select_keys');
    setId(id + 1);
    const nextKeys = keys.concat(id);
    form.setFieldsValue({
      select_keys: nextKeys,
    });
  };
  const showSelect = k => {
    setSsid(k);
    console.log(selects);
    const select_records = selects[k] || {};
    setEditingdatail(select_records);
    setModalVisible(true);
  };

  getFieldDecorator('select_keys', { initialValue: record.select_keys ? record.select_keys : [] });
  const keys = getFieldValue('select_keys');
  const formItems = keys.map(k => (
    <Row key={k}>
      <Col span={20}>
        <Button span={24} type="dashed" onClick={() => showSelect(k)}>
          select-{k}
        </Button>
      </Col>
      <Col span={4}>
        <Form.Item>
          <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => remove(k)} />
        </Form.Item>
      </Col>
    </Row>
  ));

  return (
    <div>
      <Fragment>
        <Form.Item {...formItemLayout} label="select">
          {formItems}
          <Button span={24} type="primary" onClick={addSelect}>
            <Icon type="plus" /> 添加
          </Button>
        </Form.Item>
        <Form.Item {...formItemLayout} label="defaultNum">
          {getFieldDecorator('defaultNum', {
            initialValue: record.defaultNum,
            rules: [],
          })(<InputNumber placeholder="默认最多展示个数" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} style={{ display: 'none' }}>
          {getFieldDecorator('select', {
            initialValue: selects,
            rules: [],
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="eventTypes">
          {eventItems}
          <Button span={24} type="primary" onClick={addEvent}>
            <Icon type="plus" /> 添加
          </Button>
        </Form.Item>
      </Fragment>
      <CreateForm modalVisible={modalVisible} hideModal={hideModal} />
    </div>
  );
});

export default CommonForm;
