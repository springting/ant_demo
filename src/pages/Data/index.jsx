import { Suspense, useState } from 'react';
import { connect } from 'dva';
import { Table,Card,Row, Col, DatePicker } from 'antd';
import { G2 } from '@ant-design/charts';
import { ChoroplethMap } from '@ant-design/maps';
import styles from './style.less';
import ShopsHot from './components/shopsHot';
import BrandsHot from './components/brandsHot';
import TotalUsers from './components/totalUsers';
import CurrentUsers from './components/currentUsers';

const auth = localStorage.getItem('antd-pro-authority').slice(2,-2);

function Data({ datatable, dispatch, loading }) {
  const { shops_hot, brands_hot, current_user, users, total_num } = datatable;
  const { RangePicker } = DatePicker;

  const onChange = e => {   
    const start_at = e[0].format('YYYY-MM-DD') + ' 00:00:00';
    const end_at = e[1].format('YYYY-MM-DD') + ' 23:59:59';
    console.log(start_at, end_at)
    dispatch({
      type: 'datatable/fetch',
      payload: { start_at, end_at }
    })
  };

  return (
    <div className={styles.dataList} style={{'display': ['developer', 'admin'].includes(auth) ? '' : 'none'}}>
      <h2 style={{ textAlign: 'center'}}>奥莱地图数据大屏</h2>
      <Row style={{textAlign: 'right', marginBottom: 10, marginRight: 10}}>
        <RangePicker style={{width: 256}} onChange={onChange}/>
      </Row>
      <Row gutter={18} style={{marginBottom: 18}}>
        <Col md={7} sm={12} xs={24}>
          <Card style={{ height: '600px'}}>
            <h1>门店热榜</h1>
            <ShopsHot data={shops_hot} loading={loading}/>
          </Card>
        </Col>
        <Col md={11} sm={24} xs={36}>
          <Card style={{height: '600px'}}>
            <h1>全站累计访问用户数</h1>
            <TotalUsers data={users} total_num={total_num}/>
          </Card>
        </Col>
        <Col md={6} sm={12} xs={24}>
          <Card style={{height: '600px'}}>
            <h1>实时用户</h1>
            <CurrentUsers data={current_user} loading={loading}/>
          </Card>
        </Col>
      </Row>
      <Row gutter={18} style={{marginBottom: 18}}>
        <Col md={7} sm={12} xs={24}>
          <Card style={{ height: '600px'}}>
            <h1>品牌热榜</h1>
            <BrandsHot data={brands_hot} loading={loading}/>
          </Card>
        </Col>
      </Row>
      <div style={{position: 'fixed', right: '30px', bottom: '20px'}}>
        <img
          src="https://pic.vongcloud.com/images/62bac711a2a1117cab00b69d.jpg"
          alt="更多统计数据请扫码查看"
          width="150"
        />
      </div>
    </div>
    
  );
}

export default connect(({ datatable, global, loading }) => ({
    datatable,
    global,
    loading,
}))(Data);
