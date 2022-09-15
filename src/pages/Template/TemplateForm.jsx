/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'dva';
import { Card, Divider } from 'antd';
import DetailForm from './DetailForm';

function TemplateForm({ location, dispatch, templatetable }) {
  const { upData } = templatetable;
  const rows = location.state.upData || [];
  const datacol = [];

  if (location.state.upData) {
    for (const i in location.state.upData[0]) {
      for (const j in location.state.upData) {
        if (location.state.upData[j][i].length > 0) {
          datacol.push(location.state.upData[j][i]);
          break;
        }
      }
    }
  }

  const editingdetail = location.state.detail || undefined;
  const sbs = location.state.sbs || {};
  const submitData = params =>
    dispatch({
      type: 'templatetable/addTemplate',
      payload: { type: 'supply_template', formItem: params, data: rows },
    });

  return (
    <Card bordered={false}>
      <h1>
        编辑进货单识别模板
        <a
          href="https://www.bilibili.com/video/BV1Fp4y1a78C?from=search&seid=15984049846098478324"
          target="_blank"
          style={{ marginLeft: 8, fontSize: 14 }}
        >
          点击进入教学视频
        </a>
      </h1>
      <Divider />
      <DetailForm
        submitData={submitData}
        datacol={datacol}
        upData={upData}
        editingdetail={editingdetail}
        sbs={sbs}
        dispatch={dispatch}
      />
    </Card>
  );
}

export default connect(({ templatetable }) => ({ templatetable }))(TemplateForm);
