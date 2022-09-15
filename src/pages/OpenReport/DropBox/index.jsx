/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import React, { Fragment, useState } from 'react';
import { connect } from 'dva';
import { Card, Upload, Icon, Divider, Table, Row, Col, Tag, Button, message, Input } from 'antd';

const { Dragger } = Upload;

const DropBox = ({ dropbox, loading, dispatch }) => {
  const { desc, demos, reportname, upFileName, upData, remark } = dropbox;
  const isLoading = loading.effects['dropbox/pageInit'];
  const isSubmmiting = loading.effects['dropbox/submit'];
  const [description, setDescription] = useState();
  const uploadChange = info => {
    const { status } = info.file;
    if (status === 'done') {
      const { response } = info.file;
      if (response.err === 0) {
        message.success(`${info.file.name}上传成功`);
        const { filename } = response;
        dispatch({ type: 'dropbox/filePreview', payload: { reportname, f: filename, json: 1 } });
      }
    } else if (status === 'error') {
      message.error(`${info.file.name}上传失败`);
    }
  };
  return isLoading ? (
    <Card bordered={false}>正在初始化...</Card>
  ) : (
    <Card bordered={false}>
      <h1>{desc}上传</h1>
      <Divider />
      <p>
        示例模板下载：
        {demos &&
          demos.map(demo => (
            <a key={demo} href={`/ana-api/${demo}`}>
              {demo.match(/.*\/([^/]*)/)[1]}
            </a>
          ))}
      </p>
      <Row style={{ padding: '30px 0' }}>
        <Col span={10} offset={7}>
          <Dragger
            showUploadList={false}
            name="file"
            action="/ana-api/duizhang"
            onChange={uploadChange}
            accept=".xlsx,.xls,.csv"
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击或拖动到此处上传</p>
            <p className="ant-upload-hint">
              注意上传指定格式的文件，具体模板可以上方示例模板中下载。
            </p>
          </Dragger>
        </Col>
      </Row>
      {upData && (
        <Fragment>
          <Row>
            <Tag>{upFileName}</Tag>上传成功，{remark ? '请填写审批意见' : '确认提交数据？'}
          </Row>
          {remark && (
            <Row>
              <Input.TextArea
                rows={4}
                style={{ width: '60%' }}
                placeholder="审批意见"
                onChange={e => setDescription(e.target.value)}
              />
            </Row>
          )}
          <Row>
            <Button
              type="primary"
              loading={isSubmmiting}
              onClick={() =>
                dispatch({
                  type: 'dropbox/submit',
                  payload: { reportname, f: upFileName, json: 1, description },
                })
              }
            >
              {remark ? '提交审批' : '提交更新'}
            </Button>
          </Row>
          <Row style={{ padding: '30px 0' }}>
            <Table
              columns={upData[0].map((col, idx) => ({ title: col, dataIndex: idx, key: idx }))}
              dataSource={upData.slice(1)}
            />
          </Row>
        </Fragment>
      )}
    </Card>
  );
};

export default connect(({ dropbox, loading }) => ({ dropbox, loading }))(DropBox);
