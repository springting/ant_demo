/* eslint-disable camelcase */
import React, { useState } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Form,
  Row,
  Col,
  Table,
  Divider,
  Input,
  Switch,
  Modal,
  message,
  Select,
} from 'antd';
import styles from './style.less';

const { confirm } = Modal;

const submitButton = {
  marginRight: '5px',
  background: '#009688',
  color: '#fff',
};
const deleteButton = {
  marginRight: '5px',
};

const RenderForm = Form.create()(props => {
  const { form, bill_sid, dispatch, percent } = props;
  const [disp, setDisp] = useState();
  const { getFieldDecorator } = form;

  const handleSearch = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // const { pro_md5, gen_sku, bill_sid, blank, search, youzan } = fieldsValue;

      dispatch({
        type: 'warehouse/fetch',
        payload: { ...fieldsValue, f: 'json' },
      });
    });
  };

  const handleFormReset = () => {
    form.validateFields(err => {
      if (err) return;
      form.resetFields();
    });
  };

  const refresh = record => {
    confirm({
      title: '该操作需较长时间，确定开始？',
      onOk() {
        setDisp(record);
        dispatch({
          type: 'warehouse/refresh',
          payload: { bill_sid, disp: record },
        });
      },
      onCancel() {},
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 2, lg: 6, xl: 12 }}>
        <Col md={3} sm={12}>
          <Form.Item>{getFieldDecorator('gen_sku')(<Input placeholder="请输入款号" />)}</Form.Item>
        </Col>
        <Col md={3} sm={12}>
          <Form.Item>
            {getFieldDecorator('bill_sid', {
              initialValue: bill_sid,
            })(<Input placeholder="请输入订单号" />)}
          </Form.Item>
        </Col>
        <Col md={3} sm={6}>
          <Form.Item>
            {getFieldDecorator('blank')(
              <Select style={{ width: '100%' }} placeholder="是否有图" allowClear>
                <Select.Option value="off">有图</Select.Option>
                <Select.Option value="on">无图</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={4} sm={6}>
          <Form.Item>
            {getFieldDecorator('click')(
              <Select style={{ width: '100%' }} placeholder="是否手动匹配" allowClear>
                <Select.Option value="on">已手动匹配</Select.Option>
                <Select.Option value="off">未手动匹配</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={4} sm={6}>
          <Form.Item>
            {getFieldDecorator('search')(
              <Select style={{ width: '100%' }} placeholder="图片匹配方式" allowClear>
                <Select.Option value="on">自动匹配</Select.Option>
                <Select.Option value="off">手动匹配</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={4} sm={6}>
          <Form.Item>
            {getFieldDecorator('youzan')(
              <Select style={{ width: '100%' }} placeholder="是否编辑审核" allowClear>
                <Select.Option value="off">已编辑审核</Select.Option>
                <Select.Option value="on">未编辑审核</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={3} sm={12}>
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit" onClick={handleSearch}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
              重置
            </Button>
          </span>
        </Col>
      </Row>
      <Row gutter={{ md: 4, lg: 12, xl: 24 }}>
        <span className={styles.submitButtons}>
          <Button type="primary" style={{ marginLeft: 10 }} onClick={() => refresh()}>
            {!disp && percent !== undefined ? '刷新到仓库(' + percent + ')' : '刷新到仓库'}
          </Button>
          <Button type="danger" style={{ marginLeft: 20 }} onClick={() => refresh(1)}>
            {disp === 1 && percent !== undefined ? '直接上架(' + percent + ')' : '直接上架'}
          </Button>
          <Button style={{ marginLeft: 20 }} onClick={() => refresh(2)}>
            {disp === 2 && percent !== undefined ? '关联图片(' + percent + ')' : '关联图片'}
          </Button>
        </span>
      </Row>
    </Form>
  );
});

function ItemsTable({ warehouse, dispatch, loading }) {
  const { items, bill_sid, percent } = warehouse;
  const [index, setIndex] = useState();
  const resetButton = record => {
    dispatch({
      type: 'warehouse/reset',
      payload: { reset: 'true', pro_md5: record.pro_md5 },
    });
  };
  const updateButton = record => {
    dispatch({
      type: 'warehouse/updateProMd5',
      payload: { update_md5: 'true', pro_md5: record.pro_md5 },
    });
  };
  const onCopy = record => {
    const oInput = document.createElement('input');
    oInput.value = record.pro_md5;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand('Copy'); // 执行浏览器复制命令
    message.success('物料号复制成功');
    oInput.remove();
  };
  const toDetail = record => {
    onCopy(record);
    if (record.urls) {
      const w = window.open('about:blank');
      w.location.href = `${record.urls[0]}`;
    }
  };
  const toTaobao = record => {
    // onCopy(record);
    const w = window.open('about:blank');
    w.location.href = `https://s.taobao.com/search?q=${record.sku}`;
  };
  const editButton = record => {
    // const w = window.open('about:blank');
    // w.location.href = `https://youzan-erp.vongcloud.com/edit/${record.pro_md5}?bill_sid=${bill_sid}`;

    setIndex(record._id);
    dispatch({
      type: 'warehouse/edit',
      payload: { pro_md5: record.pro_md5, bill_sid, f: 'json' },
    });
  };
  const DeleteButton = record => {
    confirm({
      title: record.force ? '确定删除？' : '确定下架？',
      onOk() {
        dispatch({
          type: 'warehouse/delete',
          payload: { delete: 'true', pro_md5: record.pro_md5, force: record.force },
        });
      },
      onCancel() {},
    });
  };
  const columns = [
    {
      title: '序号',
      align: 'center',
      width: 50,
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '商品图片',
      align: 'center',
      render: record => {
        const img = record.covers ? (
          <img src={record.covers[0]} width="100px" alt="" />
        ) : record.images ? (
          <img src={record.images[0]} width="100px" alt="" />
        ) : record.srcs ? (
          <img src={record.srcs[0]} width="100px" alt="" />
        ) : (
          '复制物料号'
        );
        return <a onClick={() => toDetail(record)}> {img} </a>;
      },
    },
    {
      title: 'SKU',
      align: 'center',
      render: record => {
        const index = record.gen_sku.indexOf('/');
        const text = record.gen_sku.substring(index + 1);
        return <a onClick={() => toTaobao(record)}>{text}</a>;
      },
    },
    {
      title: '操作',
      align: 'center',
      render: record => (
        <span>
          <Button
            style={submitButton}
            onClick={() => editButton(record)}
            loading={record._id === index ? loading.effects['warehouse/edit'] : ''}
          >
            编辑
          </Button>
          <Button
            disabled={!record.images}
            style={submitButton}
            onClick={() => resetButton(record)}
          >
            清除同步信息
          </Button>
          <Button style={submitButton} onClick={() => updateButton(record)}>
            更新物料号
          </Button>
          <Button
            type="danger"
            style={deleteButton}
            onClick={() => DeleteButton({ pro_md5: record.pro_md5, force: 'true' })}
          >
            彻底删除
          </Button>
          <Button
            disabled={!record.item_id}
            type="danger"
            style={deleteButton}
            onClick={() => DeleteButton({ pro_md5: record.pro_md5 })}
          >
            有赞删除
          </Button>
        </span>
      ),
    },
    {
      title: '图片',
      // dataIndex: 'images.length',
      render: record => {
        if (record.images) {
          return record.images.length + '(已同步)';
        } else if (record.srcs) {
          return record.srcs.length + '(等待下载)';
        } else {
          return '未同步';
        }
      },
    },
    {
      title: '自动搜索',
      dataIndex: 'search',
      render: record => {
        if (record === false) {
          return 'False';
        } else if (record === true) {
          return 'True';
        } else {
          return '';
        }
      },
    },
    {
      title: '编辑时间',
      dataIndex: 'edited_at',
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <RenderForm dispatch={dispatch} bill_sid={bill_sid} percent={percent} />
        </div>
        <Divider />
        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          loading={loading.effects['warehouse/fetch']}
        />
      </div>
    </Card>
  );
}

export default connect(({ warehouse, dispatch, loading }) => ({
  warehouse,
  dispatch,
  loading,
}))(ItemsTable);
