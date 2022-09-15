/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Icon, Row, Divider } from 'antd';
import { routerRedux } from 'dva/router';

function TemplateUpData({ location, dispatch }) {
  const { upData, sbs } = location.state;
  return (
    <Card bordered={false}>
      <h1>库存表信息展示</h1>
      <Divider />
      {upData && (
        <Fragment>
          <Row>
            <Button
              type="primary"
              onClick={() =>
                dispatch(
                  routerRedux.push({
                    pathname: `/setting/template/form`,
                    state: { upData, sbs },
                  }),
                )
              }
            >
              开始模板配置
              <Icon type="right" />
            </Button>
          </Row>
          <Row style={{ padding: '30px 0', display: 'block', width: '100%', overflowX: 'scroll' }}>
            <Table
              columns={upData[0].map((col, idx) => ({ title: col, dataIndex: idx, key: idx }))}
              dataSource={upData.slice(1)}
              pagination={false}
              scroll={{ y: 450, x: 4800 }}
            />
          </Row>
        </Fragment>
      )}
    </Card>
  );
}

export default connect(({ templatetable }) => ({ templatetable }))(TemplateUpData);
