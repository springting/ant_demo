/* eslint-disable camelcase */
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Row, Divider, Form, Col, Modal, Select, Input, Tag } from 'antd';
import styles from './style.less';

const RenderForm = Form.create()(props => {
  const {
    result,
    sbc,
    showModal,
    setSel,
    tempMap,
    setTempMap,
    tags,
    wordlist,
    showbtnModal,
  } = props;
  // console.log(tags);

  const upData = result.rows;
  upData[0][result.baseMsg.map_idx.size_head] = '尺码区开始⇩';
  upData[0][result.baseMsg.map_idx.size_tail] = '尺码区结束⇩';
  upData[0][result.baseMsg.map_idx.sku] = '款号⇩';
  upData[0][result.baseMsg.map_idx.price_cur] = '现价⇩';
  upData[0][result.baseMsg.map_idx.color] = '颜色⇩';
  upData[0][result.baseMsg.map_idx.price_ori] = '吊牌价⇩';
  upData[0][result.baseMsg.map_idx.category] = '品类对应⇩';
  upData[0][result.baseMsg.map_idx.season] = '季节⇩';
  upData[0][result.baseMsg.map_idx.year] = '年份⇩';
  upData[0][result.baseMsg.map_idx.size] = '尺码⇩';
  upData[0][result.baseMsg.map_idx.stock] = '数量⇩';

  const setClassName = idx => {
    if (idx === result.baseMsg.map_idx.sku) {
      return styles.sku;
    } else if (idx === result.baseMsg.map_idx.price_cur) {
      return styles.price_cur;
    } else if (idx === result.baseMsg.map_idx.price_ori) {
      return styles.price_ori;
    } else if (idx === result.baseMsg.map_idx.color) {
      return styles.color;
    } else if (
      (idx >= result.baseMsg.map_idx.size_head && idx <= result.baseMsg.map_idx.size_tail) ||
      idx === result.baseMsg.map_idx.stock
    ) {
      return styles.stock;
    } else if (idx === result.baseMsg.map_idx.size) {
      return styles.size;
    } else if (idx === result.baseMsg.map_idx.category) {
      return styles.category;
    }
  };

  const handleClose = removedTag => {
    const removedKey = removedTag.split(':')[0];
    const { [removedKey]: _, ...newtempMap } = tempMap;
    setTempMap(newtempMap);
  };

  const columns = upData[0].map((col, idx) => {
    if (idx === result.baseMsg.map_idx.category) {
      return {
        title: col,
        dataIndex: idx,
        key: idx,
        width: 100,
        align: 'center',
        className: styles.category,
        render: text => {
          let splited = [text];
          wordlist.forEach(word => {
            const tmp = [];
            splited.forEach(sp => {
              const pos = sp.indexOf(word);
              const t =
                pos >= 0
                  ? [
                      sp.slice(0, pos),
                      sp.slice(pos, pos + word.length),
                      sp.slice(pos + word.length),
                    ]
                  : [sp];
              tmp.push(...t);
            });
            splited = tmp.filter(t => t.length > 0);
          });

          return splited.map(w => {
            if (wordlist.indexOf(w) > -1) {
              return <span className={styles.highlight}> {w} </span>;
            } else {
              return w;
            }
          });
        },
      };
    } else {
      return {
        title: col,
        dataIndex: idx,
        key: idx,
        width: 100,
        align: 'center',
        className: setClassName(idx),
      };
    }
  });

  const submitButton = () => {
    showbtnModal();
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
      <Row>
        <span style={{ fontSize: '20px' }}> 主数据模版 </span>
      </Row>
      {tags.length > 0 && (
        <Fragment>
          {tags.map(tag => (
            <Tag key={tag} closable onClose={() => handleClose(tag)}>
              {tag}
            </Tag>
          ))}
          <Divider />
        </Fragment>
      )}
      <Row style={{ display: 'block', textAlign: 'center' }}>
        <Button type="primary" size="large" onClick={submitButton}>
          制作主数据
        </Button>
      </Row>
      {upData && (
        <Fragment>
          <Row style={{ display: 'block', width: '100%', overflowX: 'scroll' }}>
            <Table
              columns={columns}
              dataSource={upData.slice(1)}
              bordered
              pagination={false}
              scroll={{ x: 2000, y: 500 }}
              style={{ marginTop: 15 }}
              onRow={record => {
                return {
                  onMouseUp: () => {
                    const select = window.getSelection().toString();
                    if (select.length >= 1) {
                      setSel(select);
                      showModal();
                    }
                  },
                };
              }}
            />
          </Row>
        </Fragment>
      )}
    </Form>
  );
});

const CreateForm = Form.create()(props => {
  const { form, hideModal, record, visible, sel, tempMap, setTempMap } = props;
  const { getFieldDecorator } = form;
  const SecondCate = Object.entries(record).map(([key, value]) => key);
  const [FinalCate, setFinalCate] = useState([]);
  // console.log(tempMap)
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { sel_str, second_cate, final_cate } = fieldsValue;
      tempMap[sel_str] = [second_cate, final_cate];
      setTempMap(tempMap);
      hideModal();
    });
  };

  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="添加品类对应关系"
      visible={visible}
      onOk={okHandle}
      onCancel={hideModal}
    >
      <Fragment>
        <Form layout="inline">
          <Form.Item>
            {getFieldDecorator('sel_str', {
              initialValue: sel,
              rules: [],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="对应二级品类">
            {getFieldDecorator('second_cate', {
              initialValue: tempMap && tempMap[sel] ? tempMap[sel][0] : undefined,
            })(
              <Select
                showSearch
                allowClear
                style={{ width: 200 }}
                onChange={second_cate => {
                  setFinalCate(record[second_cate]);
                }}
              >
                {SecondCate.map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="对应末级品类">
            {getFieldDecorator('final_cate', {
              initialValue: tempMap && tempMap[sel] ? tempMap[sel][1] : undefined,
            })(
              <Select allowClear showArrow style={{ width: 200 }}>
                {FinalCate.map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Form>
      </Fragment>
    </Modal>
  );
});

const SubmitForm = Form.create()(props => {
  const { form, hidebtnModal, btnvisible, dispatch, tempMap, sbc, result, template } = props;
  const { getFieldDecorator } = form;

  const onSubmit = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const { mappingName } = fieldsValue;
      dispatch({
        type: 'warehouse/addMainData',
        payload: {
          ...result.baseMsg.map_idx,
          result,
          f: result.origMiss.path,
          categoryMapping: tempMap,
          mappingName,
          auto: 1,
          save: 1,
          json: 1,
        },
      });
      hidebtnModal();
    });
  };

  return (
    <Modal
      width={500}
      bodyStyle={{ padding: '12px 20px 48px' }}
      destroyOnClose
      title={
        <span>
          生成<strong className={styles.highlight}>{sbc.su_conc}</strong> 主数据
        </span>
      }
      visible={btnvisible}
      onOk={onSubmit}
      onCancel={hidebtnModal}
    >
      <Fragment>
        <Form layout="inline">
          <Form.Item>
            表格中有<strong>{result.missdata.length}</strong>行未添加品类对应关系
          </Form.Item>
          <Form.Item label="主数据模版名称">
            {getFieldDecorator('mappingName', {
              initialValue: Object.keys(template).toString() || sbc.supply_sid,
              rules: [
                {
                  required: true,
                  message: '请填入主数据模版名称',
                },
              ],
            })(<Input />)}
          </Form.Item>
        </Form>
      </Fragment>
    </Modal>
  );
});

function AddMainXls({ warehouse, dispatch }) {
  const { result, sbc, cateMap, template } = warehouse;
  const [visible, setVisible] = useState(false);
  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);
  const [btnvisible, setBtnVisible] = useState(false);
  const hidebtnModal = () => setBtnVisible(false);
  const showbtnModal = () => setBtnVisible(true);
  const [sel, setSel] = useState();
  const [tempMap, setTempMap] = useState(template[sbc.supply_sid].categoryMap);
  const tempTag = Object.entries(tempMap).map(
    ([key, value]) => key + ':' + value[0] + '—' + value[1],
  );
  const wordlist = Object.entries(tempMap).map(([key, value]) => key);

  return (
    <Card>
      <div className={styles.tableListForm}>
        <RenderForm
          result={result}
          sbc={sbc}
          showModal={showModal}
          setSel={setSel}
          tags={tempTag}
          tempMap={tempMap}
          setTempMap={setTempMap}
          template={template}
          wordlist={wordlist}
          showbtnModal={showbtnModal}
        />
      </div>
      <CreateForm
        visible={visible}
        hideModal={hideModal}
        record={cateMap}
        sel={sel}
        tempMap={tempMap}
        setTempMap={setTempMap}
      />
      <SubmitForm
        btnvisible={btnvisible}
        hidebtnModal={hidebtnModal}
        dispatch={dispatch}
        tempMap={tempMap}
        sbc={sbc}
        template={template}
        result={result}
      />
    </Card>
  );
}

export default connect(({ warehouse }) => ({ warehouse }))(AddMainXls);
