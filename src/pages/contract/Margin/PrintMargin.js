/* eslint-disable react/no-string-refs */
/* eslint-disable camelcase */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import moment from 'moment';
import { digitUppercase } from '@/utils/utils';
import styles from './style.less';

class PrintMargin extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // let printView = this.refs.printRef //获取待打印元素
    // document.querySelector('#root').className = 'print-hide' //将根元素隐藏
    // document.body.appendChild(printView) //将待打印元素追加到body中
    // window.print() //调用浏览器的打印预览
    // document.body.removeChild(printView) //将待打印元素从body中移除
    // document.querySelector('#root').className = '' //将原始页面恢复
  }

  print = () => {
    const bdhtml = window.document.body.innerHTML;
    const sprnstr = '<div id="begin">'; // 开始打印标识字符串
    const eprnstr = '<div id="end"></div>'; // 结束打印标识字符串
    let prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + sprnstr.length); // 从开始打印标识之后的内容
    prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); // 截取开始标识和结束标识之间的内容
    window.document.body.innerHTML = prnhtml; // 把需要打印的指定内容赋给body.innerHTML
    window.print(); // 调用浏览器的打印功能打印指定区域
    window.document.body.innerHTML = bdhtml;
  };

  render() {
    const { printRecord, currentUser, fee_type_map, fee_title_map } = this.props;
    if (Object.keys(printRecord).length === 0) {
      return <p>加载中...</p>;
    }
    return (
      // <!--startprint-->
      <div>
        <div id="begin">
          {/* {JSON.stringify(printRecord)} */}
          <div
            ref="printRef"
            style={{
              width: '850px',
              height: '470px',
              margin: 'auto',
              fontSize: '18px',
              padding: '50px 25px 25px 25px',
              color: '#000',
              position: 'relative',
            }}
          >
            <p style={{ textAlign: 'center', fontSize: '150%' }}>
              {fee_title_map[printRecord.type]}
            </p>
            <div style={{ width: '100%' }}>
              <div style={{ float: 'left', width: '200px' }}>
                日期：{moment().format('YYYY-MM-DD')}
              </div>
              <div style={{ float: 'left', textAlign: 'center', width: '400px', fontSize: '150%' }}>
                收&#12288;据
              </div>
              <div style={{ float: 'left', width: '200px', textAlign: 'right' }}>
                编号：
                {printRecord.sequence}
              </div>
              <div style={{ clear: 'both' }} />
            </div>
            <div
              style={{
                border: '1px solid #000',
                width: '100%',
                height: '330px',
                textAlign: 'center',
                padding: '30px 20px 20px 20px',
              }}
            >
              <div className={styles['receipt-content']}>
                <div className={styles.name}>今收到：</div>
                <div className={styles.left} style={{ borderBottom: '1px solid #000' }}>
                  {`${printRecord.supply_name}  ${printRecord.counter_no || ''}`}
                </div>
                <div style={{ clear: 'both' }} />
              </div>
              <div className={styles['receipt-content']}>
                <div className={styles.name}>人民币：</div>
                <div className={styles.left} style={{ borderBottom: '1px solid #000' }}>
                  {digitUppercase(printRecord.amt / 100)}
                </div>
                <div style={{ clear: 'both' }} />
              </div>
              <div className={styles['receipt-content']}>
                <div className={styles.name}>系&#12288;付：</div>
                <div
                  className={styles.left}
                  style={{ minWidth: '300px', borderBottom: '1px solid #000' }}
                >
                  {fee_type_map[printRecord.type]}
                </div>
                <div style={{ float: 'left', fontWeight: 900, paddingLeft: '14px' }}>￥：</div>
                <div className={styles.money} style={{ borderBottom: '1px solid #000' }}>
                  {(printRecord.amt / 100).toFixed(2)}
                </div>
                <div style={{ clear: 'both' }} />
              </div>
              <div>
                <Row
                  gutter={24}
                  style={{
                    fontSize: '14px',
                    marginTop: '80px',
                    paddingLeft: '50px',
                  }}
                >
                  <Col span={6} style={{ textAlign: 'left' }}>
                    单位盖章:
                  </Col>
                  <Col span={6} style={{ textAlign: 'left' }}>
                    会计:
                  </Col>
                  <Col span={6} style={{ textAlign: 'left' }}>
                    结算:
                  </Col>
                  <Col span={6} style={{ textAlign: 'left' }}>
                    经办人:&nbsp;&nbsp;{currentUser.name}
                  </Col>
                </Row>
              </div>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '135px',
                left: '830px',
                fontSize: '10px',
                height: 'auto',
                width: '10px',
              }}
            >
              <div>白联存根</div>
              <div style={{ paddingTop: '15px' }}>粉联商户</div>
              <div style={{ paddingTop: '15px' }}>蓝联记账</div>
              <div style={{ paddingTop: '15px' }}>黄联其他</div>
            </div>
          </div>
          <div id="end" />
          <div style={{ width: '800px', margin: 'auto', paddingTop: '30px' }}>
            <Button type="primary" onClick={this.print}>
              打印
            </Button>
          </div>
        </div>
      </div>
      // <!--startprint-->
    );
  }
}

export default connect(({ contractMargin, user }) => ({
  printRecord: contractMargin.printRecord,
  fee_type_map: contractMargin.fee_type_map,
  fee_title_map: contractMargin.fee_title_map,
  currentUser: user.currentUser,
}))(PrintMargin);
