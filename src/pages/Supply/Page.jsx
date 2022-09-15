/* eslint-disable camelcase */
import { message } from 'antd';
import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Table, Button, Card, Modal, Form, Input, Select, Icon, Row, Col, Divider } from 'antd';
import styles from './style.less';
import ShanshanUpdateForm from './components/ShanShan/update';
import BeeGoInsertForm from './components/BeeGo/insert';
import BeeGoUpdateForm from './components/BeeGo/update';
import YouzanInsertForm from './components/YouZan/insert';
import YouzanUpdateForm from './components/YouZan/update';
import HycInsertForm from './components/Hyc/insert';
import HycUpdateForm from './components/Hyc/update';
import MbyzInsertForm from './components/Mbyz/insert';
import MbyzUpdateForm from './components/Mbyz/update';

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

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    hideModal,
    submitData,
    brand_list,
    category_list,
    shop_list,
    template_list,
    ctoken,
    brand_source,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;
  const [id, setId] = useState(0);

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      submitData(fieldsValue);
      hideModal();
    });
  };
  const remove = k => {
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };
  const add = () => {
    const keys = form.getFieldValue('keys');
    setId(id + 1);
    const nextKeys = keys.concat(id);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };
  getFieldDecorator('keys', { initialValue: [] });
  const keys = getFieldValue('keys');
  const formItems = keys.map(k => (
    <Row key={k.id}>
      <Col span={8}>
        <Form.Item key={k}>
          {getFieldDecorator(`brand_sid_list[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                message: '请选择品牌',
              },
            ],
          })(
            <Select
              allowClear
              mode="tags"
              placeholder="请选择签约品牌"
              style={{ width: '100%' }}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {brand_list.map(item => (
                <Select.Option key={item.sid} value={item.sid} label={item.brand_name}>
                  {item.brand_name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Col>
      <Col span={7}>
        <Form.Item key={k}>
          {getFieldDecorator(`category_sid_list[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                message: '请选择品类',
              },
            ],
          })(
            <Select allowClear placeholder="请选择品类" style={{ width: '100%' }}>
              {category_list.map(item => (
                <Select.Option key={item.category_name} value={item.sid}>
                  {item.category_name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Col>
      <Col span={7}>
        <Form.Item key={k}>
          {getFieldDecorator(`template_sid[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: false,
                message: '请选择运费模板',
              },
            ],
          })(
            <Select
              showSearch
              allowClear
              placeholder="请选择运费模板"
              style={{ width: '100%' }}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {template_list.map(item => (
                <Select.Option key={item.template_name} value={item.sid} label={item.template_name}>
                  {item.template_name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      </Col>
      <Col span={2}>
        <Form.Item>
          <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => remove(k)} />
        </Form.Item>
      </Col>
    </Row>
  ));

  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="添加供应商"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={hideModal}
    >
      <Form.Item {...formItemLayout} label={<span>门店</span>}>
        {getFieldDecorator('shop_sid_list', {
          rules: [
            {
              required: true,
              message: '请选择门店',
            },
          ],
        })(
          <Select showSearch allowClear placeholder="选择门店" style={{ width: '100%' }}>
            {shop_list.map(item => (
              <Select.Option key={item.sh_conc} value={item.sid}>
                {item.sh_conc}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>供应商编码</span>}>
        {getFieldDecorator('supply_sid', {
          rules: [
            {
              required: true,
              message: '请填写供应商编码',
            },
          ],
        })(<Input placeholder="供应商编码" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>供应商名称</span>}>
        {getFieldDecorator('supply_name', {
          rules: [
            {
              required: true,
              message: '请填写供应商名称',
            },
          ],
        })(<Input placeholder="供应商名称" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>税号</span>}>
        {getFieldDecorator('tax_number', {
          rules: [],
        })(<Input placeholder="税号" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>联系人电话</span>}>
        {getFieldDecorator('phone', {
          rules: [],
        })(<Input placeholder="联系人电话" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label={<span>品牌品类</span>} required={true}>
        {formItems}
        <Button span={24} type="dashed" onClick={add}>
          <Icon type="plus" /> 添加品牌品类及运费模板
        </Button>
      </Form.Item>
      {ctoken !== 'bainian' && (
        <Form.Item {...formItemLayout} label={<span>品牌图片池</span>}>
          {getFieldDecorator('standard_brand_sid')(
            <Select
              showSearch
              allowClear
              mode="multiple"
              placeholder="请选择品牌图片池"
              style={{ width: '100%' }}
              optionFilterProp="label"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {brand_source.map(item => (
                <Select.Option key={item.brand_name} value={item.sid} label={item.brand_name}>
                  {item.brand_name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
      )}
      {['bainian', 'yz_erp', 'sprs'].includes(ctoken) && <YouzanInsertForm form={form} />}
      {['beego', 'yz_erp'].includes(ctoken) && <BeeGoInsertForm form={form} />}
      {['flls', 'yz_erp'].includes(ctoken) && <MbyzInsertForm form={form} />}
      {ctoken === 'szhyc' && <HycInsertForm form={form} />}
    </Modal>
  );
});

const UpdateForm = Form.create()(props => {
  const {
    form,
    updateData,
    updatehideModal,
    category_list,
    template_list,
    shop_list,
    record,
    visible,
    brand_source,
    ctoken,
  } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const info = {
        ...fieldsValue,
        supply_sid: record.supply_sid,
        brand_token: record.brand_token,
      };
      info.sid = record.key;
      updateData(info);
      updatehideModal();
    });
  };
  return (
    <Modal
      width={980}
      bodyStyle={{ padding: '32px 20px 48px' }}
      destroyOnClose
      title="编辑供应商"
      visible={visible}
      onOk={okHandle}
      onCancel={updatehideModal}
      record={record}
    >
      <Fragment key={record.key}>
        <Form.Item {...formItemLayout} label={<span>门店</span>}>
          {getFieldDecorator('shop_sid', {
            initialValue: record.shop_sid,
            rules: [
              {
                required: true,
                message: '请选择门店',
              },
            ],
          })(
            <Select allowClear placeholder="选择门店" style={{ width: '100%' }}>
              {shop_list.map(item => (
                <Select.Option key={item.sh_conc} value={item.sid}>
                  {item.sh_conc}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>供应商编码</span>}>
          {getFieldDecorator('title', {
            initialValue: record.title,
            rules: [
              {
                required: true,
                message: '请填写供应商编码',
              },
            ],
          })(<Input placeholder="供应商编码" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>供应商名称</span>}>
          {getFieldDecorator('supply_name', {
            initialValue: record.supply_name,
            rules: [
              {
                required: true,
                message: '请填写供应商名称',
              },
            ],
          })(<Input placeholder="供应商名称" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>品类</span>}>
          {getFieldDecorator(`category_sid`, {
            initialValue: record.category_sid,
            rules: [
              {
                required: true,
                message: '请选择品类',
              },
            ],
          })(
            <Select allowClear placeholder="请选择品类" style={{ width: '100%' }}>
              {category_list.map(item => (
                <Select.Option key={item.category_name} value={item.sid}>
                  {item.category_name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>最小展示库存</span>}>
          {getFieldDecorator('wipe_off', {
            initialValue: record.wipe_off,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input allowClear placeholder="以物料号为维度的库存门槛" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={<span>总库存门槛</span>}>
          {getFieldDecorator('total_thresh', {
            initialValue: record.total_thresh,
            rules: [
              {
                required: false,
              },
            ],
          })(<Input allowClear placeholder="以款号为维度的库存门槛" />)}
        </Form.Item>
        {['beego', 'yz_erp'].includes(ctoken) && <BeeGoUpdateForm form={form} record={record} />}
        {ctoken === 'szhyc' && <HycUpdateForm form={form} record={record} />}
        {['bainian', 'yz_erp', 'sprs'].includes(ctoken) && (
          <YouzanUpdateForm form={form} record={record} template_list={template_list} />
        )}
        {['flls', 'yz_erp'].includes(ctoken) && <MbyzUpdateForm form={form} record={record} />}
        {ctoken !== 'bainian' && (
          <Form.Item {...formItemLayout} label={<span>品牌图片池</span>}>
            {getFieldDecorator('standard_brand_sid', {
              initialValue: record.standard_brand_sid,
            })(
              <Select
                showSearch
                allowClear
                mode="multiple"
                placeholder="请选择品牌图片池"
                style={{ width: '100%' }}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {brand_source.map(item => (
                  <Select.Option key={item.brand_name} value={item.sid} label={item.brand_name}>
                    {item.brand_name}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        )}
        {['shanshan', 'yz_erp', 'beego'].includes(ctoken) && (
          <ShanshanUpdateForm form={form} record={record} />
        )}
        {ctoken === 'beego' && (
          <Fragment>
            <Form.Item {...formItemLayout} label={<span>详情头图</span>}>
              {getFieldDecorator('head_img', {
                initialValue: record.head_img,
              })(
                <Input
                  allowClear
                  placeholder="填写需要放在详情头部的图片url，多张图片以逗号隔开"
                />,
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label={<span>详情尾图</span>}>
              {getFieldDecorator('tail_img', {
                initialValue: record.tail_img,
              })(
                <Input
                  allowClear
                  placeholder="填写需要放在详情尾部的图片url，多张图片以逗号隔开"
                />,
              )}
            </Form.Item>
          </Fragment>
        )}
      </Fragment>
    </Modal>
  );
});

const RenderForm = Form.create()(props => {
  const { form, supply_list, dispatch } = props;
  const { getFieldDecorator } = form;
  const handleFormReset = () => {
    form.validateFields(err => {
      if (err) return;
      form.resetFields();
    });
  };

  const handleSearch = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { supply_sid } = fieldsValue;
      dispatch({
        type: 'supplytable/fetch',
        payload: { supply_sid },
      });
    });
  };

  const handleUpdate = () => {
    dispatch({
      type: 'supplytable/refresh',
      payload: { type: 'refresh_freight' },
    });
  };

  const handleCopy = e => {
    e.preventDefault();

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { supply_sid } = fieldsValue;
      if (supply_sid) {
        dispatch({
          type: 'supplytable/refresh',
          payload: { supply_sid, type: 'refresh_category' },
        });
      } else {
        message.error('请选择供应商');
      }
    });
  };

  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={8} sm={24}>
          <Form.Item label="供应商名称">
            {getFieldDecorator('supply_sid')(
              <Select
                showSearch
                allowClear
                style={{ width: '100%' }}
                optionFilterProp="label"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {supply_list.map(item => (
                  <Select.Option key={item.sup_info} value={item.sid} label={item.sup_info}>
                    {item.sup_info}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col md={8} sm={24}>
          <span className={styles.submitButtons}>
            <Button type="primary" htmlType="submit" onClick={handleSearch}>
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
              重置
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleUpdate}>
              同步运费模板
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCopy}>
              同步品类
            </Button>
          </span>
        </Col>
      </Row>
    </Form>
  );
});

function SupplyTable({ supplytable, global, loading, dispatch }) {
  const { supplies } = supplytable;
  const { brand_list, category_list, shop_list, template_list, supply_list, brand_source } = global;
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingdetail, setEditingdatail] = useState([]);
  const hideModal = () => setModalVisible(false);
  const updatehideModal = () => setVisible(false);
  const submitData = params => dispatch({ type: 'supplytable/add', payload: params });
  const updateData = params => dispatch({ type: 'supplytable/update', payload: params });
  const showModal = record => {
    setEditingdatail(record);
    setVisible(true);
  };
  const ctoken = localStorage.getItem('ctoken');

  const Delete = record => {
    // console.log(record);
    const { key, supply_sid, brand_token, category_sid } = record;
    dispatch({
      type: 'supplytable/delete',
      payload: {
        key,
        supply_sid,
        brand_token,
        category_sid,
        type: 'delete',
      },
    });
  };
  const columns = [
    {
      title: '门店编码',
      dataIndex: 'shop_sid',
    },
    {
      title: '门店',
      dataIndex: 'shop_name',
    },
    {
      title: '供应商编码',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: '供应商名称',
      dataIndex: 'supply_name',
      sorter: (a, b) => a.supply_name.localeCompare(b.supply_name),
    },
    {
      title: '别名',
      dataIndex: 'supply_brand_shop_title',
    },
    {
      title: '品牌',
      dataIndex: 'brand_name',
      sorter: (a, b) => a.brand_name.localeCompare(b.brand_name),
    },
    {
      title: '品类',
      dataIndex: 'category_name',
      sorter: (a, b) => a.category_name.localeCompare(b.category_name),
    },
    {
      title: '运费模板',
      dataIndex: 'template_name',
    },
    {
      title: '最小展示库存',
      dataIndex: 'wipe_off',
    },
    {
      title: '总库存门槛',
      dataIndex: 'total_thresh',
    },
    {
      title: '是否为第三方',
      dataIndex: 'contact',
    },
    {
      title: '品牌图片池',
      render: record => {
        if (record.standard_brand_sid.length > 0) {
          return '已配置';
        }
      },
    },
    {
      title: '操作',
      width: 120,
      render: record => (
        <span>
          <a onClick={() => showModal(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => Delete(record)}>删除</a>
        </span>
      ),
    },
  ];

  return (
    <Card>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <RenderForm supply_list={supply_list} dispatch={dispatch} />
        </div>
        <div className={styles.tableListOperator}>
          <Button icon="plus" type="primary" onClick={() => setModalVisible(true)}>
            添加供应商
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={supplies}
          loading={loading.effects['supplytable/fetch']}
        />
      </div>
      <CreateForm
        modalVisible={modalVisible}
        hideModal={hideModal}
        submitData={submitData}
        brand_list={brand_list}
        category_list={category_list}
        shop_list={shop_list}
        template_list={template_list}
        ctoken={ctoken}
        brand_source={brand_source}
      />
      <UpdateForm
        visible={visible}
        record={editingdetail}
        updatehideModal={updatehideModal}
        updateData={updateData}
        category_list={category_list}
        template_list={template_list}
        brand_source={brand_source}
        shop_list={shop_list}
        ctoken={ctoken}
      />
    </Card>
  );
}

export default connect(({ supplytable, global, loading }) => ({
  supplytable,
  global,
  loading,
}))(SupplyTable);
