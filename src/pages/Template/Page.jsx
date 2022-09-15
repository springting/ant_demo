/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'dva';
import { Upload, Button, Card, Divider, Icon, Row, Col, message } from 'antd';
import { routerRedux } from 'dva/router';

const { Dragger } = Upload;

function TemplateTable({ templatetable, dispatch, location }) {
  const { sbs } = location.state;
  const { upData } = templatetable;
  const uploadChange = info => {
    const { status } = info.file;
    if (status === 'done') {
      const { response } = info.file;
      if (response.err === 0) {
        message.success(`${info.file.name}上传成功`);
        const { filename } = response;
        dispatch({ type: 'templatetable/filePreview', payload: { f: filename } });
      }
    } else if (status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  };
  const onClick = () => {
    dispatch(
      routerRedux.push({
        pathname: '/setting/template/upData',
        state: { upData, sbs },
      }),
    );
  };

  return (
    <Card bordered={false}>
      <h1>上传品牌库存表</h1>
      <Divider />
      <Row style={{ padding: '30px 0' }}>
        <Col>
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
            <p className="ant-upload-hint">上传品牌库存表。</p>
          </Dragger>
        </Col>
      </Row>
      {upData && (
        <Button type="primary" style={{ float: 'right' }} onClick={onClick}>
          下一步
          <Icon type="right" />
        </Button>
      )}
    </Card>
  );
}

export default connect(({ templatetable }) => ({ templatetable }))(TemplateTable);
