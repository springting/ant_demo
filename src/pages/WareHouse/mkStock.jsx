/* eslint-disable camelcase */
import React from 'react';
import { connect } from 'dva';
import { Button, Card, Icon, Result } from 'antd';

function MakeStock({ warehouse, dispatch }) {
  const { result, msg, ret } = warehouse;
  const info =
    '正在' +
    (result.baseMsg.event === 'insert' ? '导入' : '更新') +
    result.baseMsg.shop[1] +
    ' ' +
    result.baseMsg.supply[1] +
    ' ' +
    result.baseMsg.brand[1] +
    '库存';

  const onClick = () => {
    dispatch({
      type: 'warehouse/insert',
      payload: {
        event: result.baseMsg.event,
        supply_sid: result.baseMsg.supply[0],
        file_path: result.fileIn.path,
        shop_sid: result.baseMsg.shop[0],
        shop_name: result.baseMsg.shop[1],
        json: 1,
      },
    });
  };
  const editPic = () => {
    const bill_sid = msg.split(':')[1];
    dispatch({
      type: 'warehouse/fetchItems',
      payload: { bill_sid, f: 'json' },
    });
    // const w = window.open('about:blank');
    // w.location.href = `https://xzs.vongcloud.com/items?bill_sid=${bill_sid}`;
  };

  return (
    <Card>
      {msg && (
        <Result
          status="success"
          title={msg}
          extra={[
            <Button type="primary" key="submit" onClick={editPic}>
              编辑商品图片
            </Button>,
          ]}
        />
      )}
      {!msg && (
        <Result
          // status="success"
          icon={<Icon type="loading" />}
          title={info}
          extra={[
            <Button
              type="primary"
              key="download"
              href={'/xzs-api' + ret.fileIn.path.split('youzan_patch')[1]}
            >
              下载{result.baseMsg.event === 'insert' ? '添加数据' : '更新数据'}xls文件
            </Button>,
            <Button key="submit" style={{ background: '#d9534f', color: '#fff' }} onClick={onClick}>
              提交数据({ret.fileIn.cnt}件)
            </Button>,
          ]}
        />
      )}
    </Card>
  );
}

export default connect(({ warehouse }) => ({ warehouse }))(MakeStock);
