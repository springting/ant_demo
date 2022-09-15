/* eslint-disable camelcase */

import React, { useState, Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import DetailForm from './detail';

function ChartSetting({ xiaohulu, dispatch }) {
  const { detail } = xiaohulu;
  // console.log(detail)

  return (
    <Card>
      <DetailForm dispatch={dispatch} record={detail} />
    </Card>
  );
}

export default connect(({ xiaohulu }) => ({ xiaohulu }))(ChartSetting);
