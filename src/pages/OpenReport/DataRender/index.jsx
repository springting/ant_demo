/* eslint-disable react/no-array-index-key */
/* eslint-disable compat/compat */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import React, { useRef, useState, Fragment } from 'react';
import { connect } from 'dva';
import ReactToPrint from 'react-to-print';
import {
  Form,
  Button,
  Input,
  DatePicker,
  Card,
  Table,
  Select,
  Modal,
  Divider,
  message,
  InputNumber,
} from 'antd';
// import EditableTable from './component';
import moment from 'moment';
import { COMPANY_FULLNAME, TAX_INFO } from '@/settings';
import { downloadRequest } from '@/utils/request';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 14 },
  },
};
const formatFields = fieldsValue => {
  if ('start_at' in fieldsValue) {
    const start_at = fieldsValue.start_at[0].format('YYYY-MM-DD');
    const end_at = fieldsValue.start_at[1].format('YYYY-MM-DD');
    fieldsValue = { ...fieldsValue, start_at, end_at };
  }
  if ('start_time' in fieldsValue) {
    const start_time = fieldsValue.start_time[0].format('YYYY-MM-DD HH:mm');
    const end_time = fieldsValue.start_time[1].format('YYYY-MM-DD HH:mm');
    fieldsValue = { ...fieldsValue, start_time, end_time };
  }
  for (const k of Object.keys(fieldsValue)) {
    if (typeof fieldsValue[k] === 'object') {
      fieldsValue[k] = fieldsValue[k].format('YYYY-MM-DD HH:mm:ss');
    }
  }
  return fieldsValue;
};

const renderEditor = (inputType, enumValue) => {
  if (inputType === 'Date') {
    return <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />;
  }
  if (inputType === 'Number') {
    return <InputNumber style={{ minWidth: '150px' }} />;
  }
  if (inputType === 'Enum' && enumValue) {
    return (
      <Select style={{ minWidth: '150px' }}>
        {enumValue.map(v => (
          <Select.Option key={v} value={v}>
            {v}
          </Select.Option>
        ))}
      </Select>
    );
  }
  if (inputType === 'Text') {
    return <Input.TextArea />;
  }
  return <Input />;
};

const EditForm = Form.create()(props => {
  const { modalVisible, form, dm, thNames, record, onCancel, onSubmit, confirmLoading } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      Object.keys(fieldsValue).forEach(k => {
        if (moment.isMoment(fieldsValue[k]))
          fieldsValue[k] = fieldsValue[k].format('YYYY-MM-DD HH:mm:ss');
      });
      onSubmit(record, fieldsValue);
    });
  };
  const { getFieldDecorator } = form;
  return (
    <Modal
      width={720}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title={record ? '????????????' : '????????????'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
    >
      <Fragment>
        {dm &&
          dm.map(item => (
            <FormItem
              {...formItemLayout}
              label={<span>{item.NAME}</span>}
              key={item.NAME}
              style={thNames[item.NAME] ? {} : { background: 'red' }}
            >
              {getFieldDecorator(item.NAME, {
                initialValue:
                  item.TYPE === 'Date'
                    ? moment((record || {})[thNames[item.NAME]])
                    : (record || {})[thNames[item.NAME]],
              })(renderEditor(item.TYPE, item.VALUE))}
              {thNames[item.NAME] ? null : (
                <span style={{ marginLeft: '20px' }}>?????????????????????</span>
              )}
            </FormItem>
          ))}
      </Fragment>
    </Modal>
  );
});
const DataRender = ({ openreport, form, dispatch, loading }) => {
  const { params, dm, action, data, downfile, config } = openreport;
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(undefined);
  const [selectedRecords, setSelectedRecords] = useState([]);

  const { th, td } = data || { th: [], td: [] };
  // ???td??????????????????
  const tableData = td.map(row =>
    row.reduce((prev, item, idx) => {
      // const key = th[idx];
      const key = `rowkey${idx}`;
      prev[key] = item;
      return prev;
    }, {}),
  );
  // ???th??????key???name?????????map???????????????name???????????????rowkey)??????ant design???table???????????????key?????????????????????bug???????????????????????????
  const thNames = th.reduce((prev, name, idx) => {
    const key = `rowkey${idx}`;
    prev[name] = key;
    return prev;
  }, {});
  const thKeys = th.reduce((prev, name, idx) => {
    const key = `rowkey${idx}`;
    prev[key] = name;
    return prev;
  }, {});

  let printConfig = {}; // not only print config is in it, also whether the head should be fixed is in it too.
  if (typeof config === 'string') {
    try {
      printConfig = JSON.parse(config);
    } catch (error) {
      console.log('config parse error:', error);
    }
  }
  const { getFieldDecorator } = form;
  const handleSearch = e => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const payload = formatFields(fieldsValue);
      dispatch({ type: 'openreport/fetchData', payload });
    });
  };

  const showEdit = defaultValue => {
    setEditRecord(defaultValue);
    setEditVisible(true);
  };

  const hideEdit = () => {
    setEditRecord(undefined);
    setEditVisible(false);
  };

  const rowkey2name = record => {
    const newRecord = {};
    Object.keys(record).forEach(key => {
      const name = thKeys[key];
      if (name) {
        newRecord[name] = record[key];
      }
    });
    return newRecord;
  };

  const updateData = (recordOld, value) => {
    const record = rowkey2name(recordOld);
    const { sid } = record;
    if (!sid) {
      message.error('??????SID????????????????????????');
      return;
    }
    dispatch({
      type: 'openreport/updateData',
      payload: { sid, args: value },
      callback: r => {
        if (r.err === 0) {
          dispatch({ type: 'openreport/update', payload: { sid, args: value } });
          message.info('???????????????');
        } else {
          message.error(`???????????????${r.msg}`);
        }
        hideEdit();
      },
    });
  };

  const insertData = value => {
    dispatch({
      type: 'openreport/insertData',
      payload: { args: value },
      callback: r => {
        if (r.err === 0) {
          // dispatch({ type: 'openreport/update', payload: { sid: r.sid, args: value } });
          message.info(`${r.msg ? r.msg : '???????????????'}`);
        } else {
          message.error(`???????????????${r.msg}`);
        }
        hideEdit();
      },
    });
  };

  const deleteData = (recordOld, act) => {
    const record = rowkey2name(recordOld);
    const { sid } = record;
    if (!sid) {
      message.error('??????SID????????????????????????');
      return;
    }
    dispatch({
      type: 'openreport/deleteData',
      payload: { sid, action: act },
      callback: r => {
        if (r.err === 0) {
          dispatch({ type: 'openreport/delete', payload: { sid } });
          message.info('???????????????');
        } else {
          message.error(`???????????????${r.msg}`);
        }
        hideEdit();
      },
    });
  };

  const onSubmit = (record, value) => {
    if (!record) {
      insertData(value);
    } else {
      updateData(record, value);
    }
  };

  const doCall = (interfaceConfig, recordOld) => {
    const { url, param, type, refresh } = interfaceConfig;

    let args = {};
    if (type === 'global') {
      // when btn is global, param is meaningless, use current report query-param as param.
      if (form.isFieldsTouched()) {
        args = formatFields(form.getFieldsValue());
      } else {
        return message.warning('?????????????????????????????????????????????');
      }
    } else {
      const record = rowkey2name(recordOld);
      param.forEach(k => {
        args[k] = record[k];
      });
    }

    // eslint-disable-next-line no-unused-vars
    const pms = new Promise((resolve, reject) => {
      dispatch({
        type: 'openreport/callApi',
        payload: { url, args },
        callback: r => {
          if (r.err === 0) {
            message.info(r.msg || '???????????????');
            if (refresh) {
              // ????????????
              dispatch({
                type: 'openreport/fetchData',
                payload: formatFields(form.getFieldsValue()),
              });
            }
          } else {
            message.error(`???????????????${r.msg}`);
          }
          resolve();
        },
      });
    });
    return pms;
  };

  const callInterface = (interfaceConfig, recordOld) => {
    const { confirm, label, download } = interfaceConfig;
    console.log(interfaceConfig);
    if (download === 1) {
      // ?????????????????????????????????
      message.info('????????????');
      const { url, param } = interfaceConfig;
      const args = {};
      const record = rowkey2name(recordOld);
      param.forEach(k => {
        args[k] = record[k];
      });
      downloadRequest(url, { params: args });
    } else if (confirm) {
      // ????????????
      Modal.confirm({
        title: '????????????',
        content: `???????????????${label}????????????`,
        onOk: () => doCall(interfaceConfig, recordOld),
      });
    } else {
      doCall(interfaceConfig, recordOld);
    }
  };

  const callInterface2 = (interfaceConfig, args) => {
    // ??????batch???????????????batch?????????args?????????????????????????????????
    const { confirm, label, url, refresh } = interfaceConfig;
    // eslint-disable-next-line no-unused-vars
    const promiseFuction = (resolve, reject) => {
      dispatch({
        type: 'openreport/callApi',
        payload: { url, args },
        callback: r => {
          if (r.err === 0) {
            message.info(r.msg || '???????????????');
            if (refresh) {
              // ????????????
              dispatch({
                type: 'openreport/fetchData',
                payload: formatFields(form.getFieldsValue()),
              });
            }
          } else {
            message.error(`???????????????${r.msg}`);
          }
          resolve();
        },
      });
    };
    if (confirm) {
      // ????????????
      Modal.confirm({
        title: '????????????',
        content: `???????????????${label}????????????`,
        onOk: () => {
          return new Promise(promiseFuction);
        },
      });
    } else {
      return new Promise(promiseFuction);
    }
    return null;
  };

  const columns = th.map((title, idx) => ({
    title,
    dataIndex: `rowkey${idx}`,
    width: 120,
    render: text => <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>{text}</div>,
  }));

  const globalAction = (action || []).filter(item => item[Object.keys(item)[0]].type === 'global');
  const rowAction = (action || []).filter(item => item[Object.keys(item)[0]].type !== 'global');

  if (columns.length > 0 && rowAction.length > 0) {
    columns.push({
      title: '??????',
      key: 'action',
      render: record => (
        <Fragment style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          {rowAction.map((item, idx) => {
            const key = Object.keys(item)[0];
            const actionFunctions = {
              update: () => showEdit(record),
              delete: () => deleteData(record, item[key].function),
            };
            const text = item[key].label;
            if (key in actionFunctions) {
              return (
                <Fragment key={idx}>
                  <a onClick={actionFunctions[key]}>{text}</a>
                  {idx === action.length - 1 ? null : <Divider type="vertical" />}
                </Fragment>
              );
            }
            if (key === 'interface') {
              return (
                <Fragment key={idx}>
                  {idx === 0 ? null : <Divider type="vertical" />}
                  <a onClick={() => callInterface(item[key], record)}>{text}</a>
                </Fragment>
              );
            }
            return null; // ??? insert???key??????????????????????????????????????????
          })}
        </Fragment>
      ),
    });
  }
  if (printConfig.confine && columns.length > 0) {
    columns[0].fixed = true;
    columns[0].width = 70;
    columns[columns.length - 1].fixed = 'right';
    columns[columns.length - 1].width = 180;
  }

  // let scaleRate = 1;
  let printScaleRate = 1;
  // if (columns.length > 10) {
  //   scaleRate = Math.max(0.8, 10 / columns.length);
  // }
  if (columns.length > 14) {
    printScaleRate = 14 / columns.length;
  }
  const printRef = useRef(); // ?????????
  let rowSelection;
  if (globalAction.filter(item => item.batch).length > 0 && tableData.length > 0) {
    // const btn = globalAction.filter(item => item.batch)[0];
    rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        // ??????row?????????????????????????????????sid
        const rows = selectedRows.map(row => row[thNames.sid]); // sid?????????
        if (rows.length > 0) {
          setSelectedRecords(rows);
        }
      },
    };
  }
  return (
    <Card bordered={false}>
      {params && params.length > 0 ? (
        <Form onSubmit={handleSearch} layout="inline">
          {params.map(({ NAME, DESCRIPTION, TYPE }) => {
            if (TYPE === 'Date') {
              if (NAME === 'start_at') {
                return (
                  <Form.Item label="????????????" key={NAME}>
                    {getFieldDecorator('start_at', {
                      rules: [{ required: true, message: '????????????????????????' }],
                    })(<RangePicker />)}
                  </Form.Item>
                );
              }
              if (NAME === 'end_at') return null;
              return (
                <Form.Item label={DESCRIPTION} key={NAME}>
                  {getFieldDecorator(NAME, {
                    rules: [{ required: true, message: `?????????${DESCRIPTION}???` }],
                  })(<DatePicker />)}
                </Form.Item>
              );
            }
            if (TYPE === 'DateTime') {
              if (NAME === 'start_time') {
                return (
                  <Form.Item label="????????????" key={NAME}>
                    {getFieldDecorator('start_time', {
                      rules: [{ required: true, message: '????????????????????????' }],
                    })(<RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />)}
                  </Form.Item>
                );
              }
              if (NAME === 'end_time') return null;
              return (
                <Form.Item label={DESCRIPTION} key={NAME}>
                  {getFieldDecorator(NAME, {
                    rules: [{ required: true, message: `?????????${DESCRIPTION}???` }],
                  })(<DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />)}
                </Form.Item>
              );
            }
            return (
              <Form.Item label={DESCRIPTION} key={NAME}>
                {getFieldDecorator(NAME, {
                  rules: [{ required: true, message: `?????????${DESCRIPTION}???` }],
                })(<Input />)}
              </Form.Item>
            );
          })}
          <Form.Item wrapperCol={{ span: 12, offset: 5 }} key="query_btn">
            <Button type="primary" htmlType="submit">
              ??????
            </Button>
          </Form.Item>
          {globalAction.map(item => {
            const key = Object.keys(item)[0];
            const cfg = item[key];
            let clickFunction = () => callInterface(cfg);
            if (key === 'insert') clickFunction = () => showEdit(undefined);
            if (key === 'batch') {
              // ??????????????????????????????????????????????????????
              clickFunction = () => {
                if (selectedRecords.length === 0) {
                  Modal.info({ title: '??????', content: '??????????????????????????????' });
                } else {
                  callInterface2(cfg, { sid_list: selectedRecords.join() }); // sid?????????join
                }
              };
            }
            return (
              <Form.Item wrapperCol={{ span: 12, offset: 5 }} key={cfg.label}>
                <Button onClick={clickFunction}>{cfg.label}</Button>
              </Form.Item>
            );
          })}
        </Form>
      ) : null}
      <div style={{ height: 40, display: 'block', paddingTop: 10 }}>
        {data && (
          <p>
            ???{data.rownum}????????????
            {printConfig && printConfig.print ? (
              <ReactToPrint
                trigger={() => <a>??????????????????</a>}
                content={() => printRef.current}
                pageStyle="@page { size: A4 landscape;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; width: 297mm } table {table-layout: automatic; width: 100% } th {word-wrap:break-word;word-break:break-all; } td {word-wrap:break-word;word-break:break-all; } .ant-table-column-title {word-wrap:break-word;word-break:break-all; } } "
              />
            ) : (
              <a href={`/${downfile}`}>??????????????????</a>
            )}
          </p>
        )}
      </div>
      {/* ????????????table */}
      <div style={{ display: 'block', width: '100%', overflowX: 'scroll' }}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={tableData}
          pagination={false}
          rowKey={th[0]}
          bordered
          scroll={printConfig.confine ? { y: 450, x: 4800 } : {}}
          loading={
            loading.effects['openreport/fetchData'] ||
            loading.effects['openreport/fetchParams'] ||
            loading.effects['openreport/insertData'] ||
            loading.effects['openreport/updateData']
          }
          style={{
            marginTop: 15,
            // transform: `scale(${scaleRate})`,
            // transformOrigin: 'top left',
            // width: `${(1 / scaleRate) * 100}%`,
          }}
        />
      </div>
      <EditForm
        modalVisible={editVisible}
        dm={dm || []}
        thNames={thNames}
        record={editRecord}
        onSubmit={onSubmit}
        onCancel={hideEdit}
        confirmLoading={
          loading.effects['openreport/updateData'] || loading.effects['openreport/insertData']
        }
      />
      {/* ???????????????table */}
      {printConfig && printConfig.print && (
        <div style={{ display: 'none' }}>
          <Table
            title={() => (
              <h2 style={{ textAlign: 'center' }}>
                {printConfig.title && tableData.length > 0
                  ? tableData[0][thNames[printConfig.title]]
                  : null}
              </h2>
            )}
            ref={printRef}
            columns={columns
              .filter(row => row.title !== printConfig.title)
              .map(row => ({ ...row, align: 'center' }))}
            dataSource={tableData}
            pagination={false}
            rowKey={th[0]}
            size="small"
            style={{
              transform: `scale(${printScaleRate})`,
              transformOrigin: 'left',
              width: `${(1 / printScaleRate) * 100}%`,
            }}
            footer={() => (
              <div
                style={{ width: '95%', display: 'block', margin: '10px auto', fontSize: '110%' }}
              >
                <p>?????????{COMPANY_FULLNAME}</p>
                <p>?????????????????????{TAX_INFO[0]}</p>
                <p>?????????{TAX_INFO[1]}</p>
                <p>?????????{TAX_INFO[2]}</p>
                <p>????????????{TAX_INFO[3]}</p>
                <p>?????????{TAX_INFO[4]}</p>
                <p style={{ textAlign: 'end' }}>{COMPANY_FULLNAME}</p>
              </div>
            )}
          />
        </div>
      )}
    </Card>
  );
};

export default connect(({ openreport, loading }) => ({ openreport, loading }))(
  Form.create()(DataRender),
);
