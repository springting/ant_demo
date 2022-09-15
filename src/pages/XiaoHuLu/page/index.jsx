import React, { useState, Fragment, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Tabs } from 'antd';
import { routerRedux } from 'dva/router';
import PageDetailForm from './detail';

const { TabPane } = Tabs;
const ButtonGroup = Button.Group;

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
};

const PageForm = Form.create()(props => {
  const { form, dispatch, detail, charts } = props;
  const { getFieldDecorator } = form;
  const [record, setRecord] = useState({ col: [] });
  const res = detail && detail.col ? detail.col[0] : {};
  const [data, setData] = useState([]);
  const [id, setId] = useState(0);

  useEffect(() => {
    setRecord(detail);
    setData(res);
  }, [detail]);

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { page, desc, ...col_detail } = fieldsValue;
      var cols = [...record.col];
      cols[id] = col_detail;
      const res = { page, desc, col: cols };
      // console.log(res)
      setRecord(res);
      dispatch({
        type: 'xiaohulu/add',
        payload: { service: 'xiaohulu.page_update', data: res, id: detail.id },
      });
    });
  };

  const onCancel = () => {
    dispatch({ type: 'xiaohulu/clear' });
    dispatch(
      routerRedux.push({
        pathname: '/xiaohulu/page',
      }),
    );
  };

  const onChange = e => {
    console.log(e);
    setData({});
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { page, desc, ...col_detail } = fieldsValue;
      // console.log(col_detail)
      console.log(record);
      var cols = [...record.col];
      // console.log(cols)
      cols[id] = col_detail;
      const res = { page, desc, col: cols };
      setRecord(res);
      form.resetFields();
    });
    setId(e);
    const res = record && record.col && record.col[e] ? record.col[e] : {};
    // console.log(res)
    setData(res);
  };

  const handlerChange = (e, val) => {
    // console.log(e.target.value);
    var res = { ...record };
    res[val] = e.target.value;
    setRecord(res);
  };

  return (
    <Fragment>
      <Form.Item {...formItemLayout} label="name">
        {getFieldDecorator('page', {
          initialValue: record.page,
          rules: [],
        })(<Input placeholder="页面名称" onChange={e => handlerChange(e, 'name')} />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="name">
        {getFieldDecorator('desc', {
          initialValue: record.desc,
          rules: [],
        })(<Input placeholder="页面描述" onChange={e => handlerChange(e, 'desc')} />)}
      </Form.Item>
      <Tabs tabPosition="left" onChange={onChange}>
        <TabPane tab="Col 1" key="0">
          <PageDetailForm form={form} record={data} charts={charts}/>
        </TabPane>
        <TabPane tab="Col 2" key="1">
          <PageDetailForm form={form} record={data} charts={charts}/>
        </TabPane>
        <TabPane tab="Col 3" key="2">
          <PageDetailForm form={form} record={data} charts={charts}/>
        </TabPane>
        <TabPane tab="Col 4" key="3">
          <PageDetailForm form={form} record={data} charts={charts}/>
        </TabPane>
      </Tabs>
      <ButtonGroup style={{ float: 'right', margin: 50 }}>
        <Button onClick={onCancel}> 取消 </Button>
        <Button type="primary" style={{ marginLeft: 16 }} onClick={okHandle}>
          确定
        </Button>
      </ButtonGroup>
    </Fragment>
  );
});

// export default PageForm;
function PageSetting({ xiaohulu, dispatch }) {
  const { detail, charts } = xiaohulu;

  return (
    <Card>
      <PageForm dispatch={dispatch} detail={detail} charts={charts}/>
    </Card>
  );
}

export default connect(({ xiaohulu }) => ({ xiaohulu }))(PageSetting);
