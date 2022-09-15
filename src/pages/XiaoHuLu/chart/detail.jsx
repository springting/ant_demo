import React, { useState, useEffect, Fragment } from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { routerRedux } from 'dva/router';
import CommonForm from './components/common';
import TimeForm from './components/timeSelect';
import BarForm from './components/bar';
import PieForm from './components/pie';
import WordForm from './components/word';
import TableForm from './components/table';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18 },
};

const ButtonGroup = Button.Group;

const DetailForm = Form.create()(props => {
  const { form, dispatch, record } = props;
  const { getFieldDecorator, getFieldValue } = form;

  // const record = { type: "bar", name: "bar2", desc: "测试表2", api: "ov?brand_id=1,93,692,512,63", average: false ,defaultNum: 4,  key: ['name', 'name'], keys: [0, 1], label: ['互动数', '提及数'],  selectDefault: "interaction", selectType: "radio", showToolBox: true, span: "12", stack: false, style:'{"height":"400px","background":"#fff","padding":"20px","margin":"12px"}', title: "分布",  value: ['interaction', 'exposure']}
  // const record = {};
  const [type, setType] = useState(undefined);

  useEffect(() => {
    setType(record.type);
  }, [record]);

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      dispatch({
        type: 'xiaohulu/add',
        payload: { service: 'xiaohulu.chart_update', data: { ...fieldsValue, id: record.id } },
      });
    });
  };

  const onCancel = () => {
    dispatch({ type: 'xiaohulu/clear' });
    dispatch(
      routerRedux.push({
        pathname: '/xiaohulu/chart',
      }),
    );
  };

  const handlerChange = (e, val) => {
    // console.log(e, val)
    setType(e.target.value);
  };

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="name">
        {getFieldDecorator('name', {
          initialValue: record.name,
          rules: [{ required: true }],
        })(<Input placeholder="需要一个英文的表名" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="desc">
        {getFieldDecorator('desc', {
          initialValue: record.desc,
          rules: [{ required: true }],
        })(<Input placeholder="需要一个中文的描述" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="type">
        {getFieldDecorator('type', {
          initialValue: record.type,
          rules: [{ required: true }],
        })(<Input onChange={handlerChange} />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="comData">
        <Form.Item {...formItemLayout} label="title">
          {getFieldDecorator('title', {
            initialValue: record.title,
            rules: [],
          })(<Input placeholder="标题" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="api">
          {getFieldDecorator('api', {
            initialValue: record.api,
            rules: [],
          })(<Input />)}
        </Form.Item>
        {['bar', 'Pie', 'Line', 'Radar'].includes(type) && (
          <CommonForm form={form} record={record} />
        )}
        {type === 'bar' && <BarForm form={form} record={record} />}
        {type === 'Pie' && <PieForm form={form} record={record} />}
        {type === 'TimeSelect' && <TimeForm form={form} record={record} />}
        {type === 'Word' && <WordForm form={form} record={record} />}
        {type === 'TableCom' && <TableForm form={form} record={record} />}
      </Form.Item>
      <ButtonGroup style={{ float: 'right' }}>
        <Button onClick={onCancel}> 取消 </Button>
        <Button type="primary" style={{ marginLeft: 16 }} onClick={okHandle}>
          确定
        </Button>
      </ButtonGroup>
    </Fragment>
  );
});

export default DetailForm;
