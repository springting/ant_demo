import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Input, Form, Row, Col, Card } from 'antd';
import styles from './page.less';

class ContractList extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, pageSize } = this.props;
    form.validateFields({ force: true }, (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        count: pageSize,
        members: '',
      };
      if (!err) {
        dispatch({
          type: 'todo',
          payload: {
            ...values,
          },
        });
      }
    });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Card title="查询条件" bordered={false}>
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <Row>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
              供应商编号：
              {getFieldDecorator('supply_sid', {
                rules: [{ required: false, message: '请输入供应商编号' }],
              })(<Input placeholder="供应商编号" style={{ width: '150px', marginRight: '20px' }} />)}
            </Col>
            <Col xs={24} sm={12} md={12} lg={12} xl={6}>
              <Button className={styles.submit_btn} type="primary" htmlType="submit">查询</Button>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}

export default connect(() => ({}))(Form.create()(ContractList));
