/* eslint-disable camelcase */
/* 严格来说并不是一个Form，只是Form的一部分 */
import React, { Fragment, useState } from 'react';
import { Form, Input, Icon, DatePicker, Radio, Tooltip, Select } from 'antd';
import moment from 'moment';
import TransEditor from '../TransEditor';
import AdminFeeEditor from '../AdminFeeEditor';
import RentEditor from '../RentEditor';
import styles from './index.less';
import { settleMode } from '@/settings';

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
const { RangePicker } = DatePicker;

export default ({
  form,
  contractContractList: {
    supply_list,
    trans_rate_list,
    fee_type_list,
    editingDetail,
    trans_rate_obj,
    shop_list,
    brandRange,
  },
}) => {
  const { getFieldDecorator } = form;
  const [supplySid, setSupplySid] = useState();
  return (
    <Fragment key={editingDetail.sid}>
      <FormItem {...formItemLayout} label={<span>门店编号</span>}>
        {getFieldDecorator('shop_sid', {
          rules: [
            {
              required: true,
              message: '请填写门店编号',
            },
          ],
          initialValue: editingDetail.shop_sid ? editingDetail.shop_sid.toString() : undefined,
        })(
          <Select style={{ width: '100%' }}>
            {shop_list.map(s => (
              <Select.Option key={s.sid} value={s.sid}>
                {s.shop_name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={<span>供应商</span>}>
        {getFieldDecorator('supply_sid', {
          rules: [
            {
              required: true,
              message: '请选择供应商',
            },
          ],
          initialValue: editingDetail.supply_sid,
        })(
          <Select
            style={{ width: '100%' }}
            onChange={supply_sid => {
              // eslint-disable-next-line no-underscore-dangle
              window.g_app._store.dispatch({
                type: 'contractContractList/fetchBrands',
                payload: { supply_sid },
              });
              setSupplySid(supply_sid);
            }}
          >
            {supply_list &&
              supply_list.map(item => (
                <Select.Option key={item.sid} value={item.sid}>
                  {item.supply_name}
                </Select.Option>
              ))}
          </Select>,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={<span>签约品牌</span>}>
        {getFieldDecorator('brand_token', {
          // rules: [
          //   {
          //     required: true,
          //     message: '请选择供签约品牌',
          //   },
          // ],
          initialValue: editingDetail.brand_token ? editingDetail.brand_token.split(',') : [],
        })(
          <Select mode="multiple" style={{ width: '100%' }} placeholder="请点击选择要签约的品牌">
            {brandRange[editingDetail.supply_sid || supplySid] &&
              brandRange[editingDetail.supply_sid || supplySid].map(item => (
                <Select.Option key={item.brand_token} value={item.brand_token}>
                  {item.brand_name}
                </Select.Option>
              ))}
          </Select>,
        )}
      </FormItem>
      <FormItem {...formItemLayout} label={<span>结算模式</span>}>
        <div>
          {getFieldDecorator('model', {
            initialValue: editingDetail.model,
            rules: [
              {
                required: true,
                message: '请选择结算模式',
              },
            ],
          })(
            <Radio.Group>
              {Object.keys(settleMode).map(k => (
                <Radio key={k} value={k}>
                  {settleMode[k]}
                </Radio>
              ))}
            </Radio.Group>,
          )}
        </div>
      </FormItem>

      <FormItem {...formItemLayout} label={<span>有效日期</span>}>
        {getFieldDecorator('date', {
          rules: [
            {
              required: true,
              message: '有效日期',
            },
          ],
          initialValue: [moment(editingDetail.start_at), moment(editingDetail.end_at)],
        })(<RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />)}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label={
          <span>
            合同号
            <em className={styles.optional}>
              （选填）
              <Tooltip title="可填入外部合同编号">
                <Icon type="info-circle-o" style={{ marginRight: 4 }} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {getFieldDecorator('contract_no', {
          initialValue: editingDetail.contract_no,
        })(<Input placeholder="外部合同号" />)}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label={
          <span>
            柜组号
            <em className={styles.optional}>
              （选填）
              <Tooltip title="可填入柜组号">
                <Icon type="info-circle-o" style={{ marginRight: 4 }} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {getFieldDecorator('counter_no', {
          initialValue: editingDetail.counter_no,
        })(<Input placeholder="请填写柜组号" />)}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label={
          <span>
            计费面积
            <em className={styles.optional}>
              （选填）
              <Tooltip title="可填面积">
                <Icon type="info-circle-o" style={{ marginRight: 4 }} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {getFieldDecorator('area', {
          initialValue: editingDetail.area,
        })(<Input placeholder="请填写合同面积" />)}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label={
          <span>
            租金
            <em className={styles.optional}>
              （选填）
              <Tooltip title="可填入租金">
                <Icon type="info-circle-o" style={{ marginRight: 4 }} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {getFieldDecorator('rental_regex', {
          initialValue: editingDetail.rental_regex,
        })(<RentEditor area={form.getFieldValue('area')} />)}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label={
          <span>
            扣率信息
            <em className={styles.optional}>
              （选填）
              <Tooltip title="扣率信息">
                <Icon type="info-circle-o" style={{ marginRight: 4 }} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {getFieldDecorator('deduction_rate_regex', {
          initialValue: editingDetail.deduction_rate_regex,
        })(<TransEditor />)}
      </FormItem>

      <FormItem
        {...formItemLayout}
        label={
          <span>
            综合管理费
            <em className={styles.optional}>
              （选填）
              <Tooltip title={<span>综合管理费</span>}>
                <Icon type="info-circle-o" style={{ marginRight: 4 }} />
              </Tooltip>
            </em>
          </span>
        }
      >
        {getFieldDecorator('admin_fee_regex', {
          initialValue: editingDetail.admin_fee_regex,
        })(
          <AdminFeeEditor
            trans_rate_list={trans_rate_list}
            fee_type_list={fee_type_list}
            trans_rate_obj={trans_rate_obj}
          />,
        )}
      </FormItem>
    </Fragment>
  );
};
