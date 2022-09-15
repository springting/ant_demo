/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Row, Divider, Form, Col } from 'antd';
import styles from './style.less';

const RenderForm = Form.create()(props => {
  const { dispatch, results, sbc } = props;

  const upData = results.rows;
  const onclick = () => {
    const { baseMsg, fileMiss, fileIn, origMiss, fileInCnt } = results;
    const result = { baseMsg, fileMiss, fileIn, origMiss, fileInCnt };
    dispatch({
      type: 'warehouse/addMaindataSubmit',
      payload: { result, json: 1, event: 'make', auto: 1 },
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={10} sm={30}>
          <Form.Item label="供应商">{sbc.su_conc}</Form.Item>
        </Col>
        <Col md={6} sm={18}>
          <Form.Item label="品牌">{sbc.brand_name}</Form.Item>
        </Col>
        <Col md={4} sm={12}>
          <Form.Item label="品类">{sbc.category_name}</Form.Item>
        </Col>
      </Row>
      <Divider />
      {upData && (
        <Fragment>
          <Row style={{ padding: '15px' }}>
            <h3>
              请检查<strong className={styles.highlight}>{sbc.brand_name}</strong> 主数据信息
            </h3>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <Col md={12} sm={36}>
              <Button
                type="primary"
                key="download"
                href={'/xzs-api' + results.file_path.split('youzan_patch')[1]}
              >
                下载主数据Xls
              </Button>
            </Col>
            <Col md={6} sm={18}>
              <Button style={{ background: '#5bc0de' }} onClick={onclick}>
                主数据没问题，进行下一步！
              </Button>
            </Col>
          </Row>
          <Row style={{ display: 'block', width: '100%', overflowX: 'scroll' }}>
            <Table
              columns={upData[0].map((col, idx) => ({
                title: col,
                dataIndex: idx,
                key: idx,
                width: 100,
                align: 'center',
              }))}
              dataSource={upData.slice(1)}
              bordered
              pagination={false}
              scroll={{ x: 2000, y: 500 }}
              style={{ marginTop: 15 }}
            />
          </Row>
        </Fragment>
      )}
    </Form>
  );
});

function CheckMainXls({ warehouse, dispatch }) {
  const { results, sbc } = warehouse;

  return (
    <Card>
      <div className={styles.tableListForm}>
        <RenderForm dispatch={dispatch} results={results} sbc={sbc} />
      </div>
    </Card>
  );
}

export default connect(({ warehouse }) => ({ warehouse }))(CheckMainXls);
