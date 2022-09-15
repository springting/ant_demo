/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Row, Divider, Form, Col } from 'antd';
import styles from './style.less';

const RenderForm = Form.create()(props => {
  const { dispatch, upData, sbc, map_idx, visible } = props;
  // console.log(map_idx);
  upData[0][map_idx.size_idx] = '尺码标识⇩';
  upData[0][map_idx.size_head] = '尺码区开始⇩';
  upData[0][map_idx.size_tail] = '尺码区结束⇩';
  upData[0][map_idx.sku] = '款号⇩';
  upData[0][map_idx.price_cur] = '现价⇩';
  upData[0][map_idx.color] = '颜色⇩';
  upData[0][map_idx.price_ori] = '吊牌价⇩';
  upData[0][map_idx.name] = '品类对应⇩';
  upData[0][map_idx.season] = '季节⇩';
  upData[0][map_idx.year] = '年份⇩';
  upData[0][map_idx.size] = '尺码⇩';
  upData[0][map_idx.stock] = '数量⇩';

  const setClassName = idx => {
    if (idx === map_idx.sku) {
      return styles.sku;
    } else if (idx === map_idx.price_cur) {
      return styles.price_cur;
    } else if (idx === map_idx.price_ori) {
      return styles.price_ori;
    } else if (idx === map_idx.color) {
      return styles.color;
    } else if ((idx >= map_idx.size_head && idx <= map_idx.size_tail) || idx === map_idx.stock) {
      return styles.stock;
    } else if (idx === map_idx.size || idx === map_idx.size_idx) {
      return styles.size;
    }
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
          <Row style={{ display: visible ? 'block' : 'none', textAlign: 'center' }}>
            <Col md={12} sm={36}>
              <Button
                type="primary"
                onClick={() =>
                  dispatch({
                    type: 'warehouse/remkStock',
                  })
                }
              >
                更新库存
              </Button>
            </Col>
            <Col md={6} sm={18}>
              <Button
                style={{ background: '#5cb85c' }}
                onClick={() =>
                  dispatch({
                    type: 'warehouse/mkStock',
                  })
                }
              >
                添加库存
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
                // className: `${styles.sku}`,
                className: setClassName(idx),
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

function ConfigStock({ warehouse, dispatch }) {
  const { upData, sbc, map_idx, visible } = warehouse;

  return (
    <Card>
      <div className={styles.tableListForm}>
        <RenderForm
          dispatch={dispatch}
          upData={upData}
          sbc={sbc}
          map_idx={map_idx}
          visible={visible}
        />
      </div>
    </Card>
  );
}

export default connect(({ warehouse }) => ({ warehouse }))(ConfigStock);
