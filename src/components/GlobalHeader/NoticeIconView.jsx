/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
import React, { Component } from 'react';
import { Modal } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
// import moment from 'moment';
// import groupBy from 'lodash/groupBy';
import { connect } from 'dva';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

class GlobalHeaderRight extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  getNoticeData = () => {
    const { notices = [] } = this.props;
    console.log(notices);
    const newNotices = notices.map(item => ({
      ...item,
      description: `${item.description.slice(0, 16)}${item.description.length > 16 ? '…' : ''}`,
      content: item.description,
    }));

    return newNotices;
  };

  getUnreadData = noticeData => {
    return noticeData.filter(n => !n.read).length;
  };

  changeReadState = clickedItem => {
    const { key } = clickedItem;
    const { dispatch } = this.props;

    if (dispatch && !clickedItem.read) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: key,
      });
    }
  };

  // handleNoticeClear = (title, key) => {
  //   const { dispatch } = this.props;
  //   message.success(
  //     `${formatMessage({
  //       id: 'component.noticeIcon.cleared',
  //     })} ${title}`,
  //   );

  //   if (dispatch) {
  //     dispatch({
  //       type: 'global/clearNotices',
  //       payload: key,
  //     });
  //   }
  // };

  render() {
    const { fetchingNotices, onNoticeVisibleChange, dispatch } = this.props;
    const noticeData = this.getNoticeData();
    const unreadCount = this.getUnreadData(noticeData);
    return (
      <NoticeIcon
        className={styles.action}
        count={unreadCount}
        // count={currentUser && currentUser.unreadCount}
        onItemClick={item => {
          dispatch({ type: 'global/close' });
          Modal.info({
            title: item.title,
            content: (
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{item.content}</pre>
            ),
            width: '70%',
            okText: item.read ? '关闭' : '已阅',
            onOk: () => this.changeReadState(item),
          });
        }}
        loading={fetchingNotices}
        // clearText={formatMessage({
        //   id: 'component.noticeIcon.clear',
        // })}
        // viewMoreText={formatMessage({
        //   id: 'component.noticeIcon.view-more',
        // })}
        // onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        // onViewMore={() => message.info('Click on view more')}
        clearClose
      >
        <NoticeIcon.Tab
          tabKey="notification"
          count={unreadCount}
          list={noticeData}
          title={formatMessage({
            id: 'component.globalHeader.notification',
          })}
          emptyText={formatMessage({
            id: 'component.globalHeader.notification.empty',
          })}
          // showViewMore
        />
        {/* <NoticeIcon.Tab
          tabKey="message"
          count={unreadMsg.message}
          list={noticeData.message}
          title={formatMessage({
            id: 'component.globalHeader.message',
          })}
          emptyText={formatMessage({
            id: 'component.globalHeader.message.empty',
          })}
          showViewMore
        />
        <NoticeIcon.Tab
          tabKey="event"
          title={formatMessage({
            id: 'component.globalHeader.event',
          })}
          emptyText={formatMessage({
            id: 'component.globalHeader.event.empty',
          })}
          count={unreadMsg.event}
          list={noticeData.event}
          showViewMore
        /> */}
      </NoticeIcon>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
}))(GlobalHeaderRight);
