import React, { useRef, useState } from 'react';
import { Pull } from 'zarm';
import styles from './BasicContentLayout.less';

const REFRESH_STATE = {
  normal: 0, // 普通
  pull: 1, // 下拉刷新（未满足刷新条件）
  drop: 2, // 释放立即刷新（满足刷新条件）
  loading: 3, // 加载中
  success: 4, // 加载成功
  failure: 5, // 加载失败
};

const BasicContentLayout: React.FC<{ loading?: boolean }> = ({ children, loading }) => {
  const pullRef = useRef();
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal);
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    setTimeout(() => {
      setRefreshing(REFRESH_STATE.success);
    }, 2000);
  };
  return (
    <Pull
      ref={pullRef}
      refresh={{
        state: refreshing,
        handler: refreshData,
        // render: (refreshState, percent) => {
        //   const cls = 'custom-control';
        //   switch (refreshState) {
        //     case REFRESH_STATE.pull:
        //       return (
        //         <div className={cls}>
        //           <ActivityIndicator loading={false} percent={percent} />
        //           <span>下拉刷新</span>
        //         </div>
        //       );

        //     case REFRESH_STATE.drop:
        //       return (
        //         <div className={cls}>
        //           <ActivityIndicator loading={false} percent={100} />
        //           <span>释放立即刷新</span>
        //         </div>
        //       );

        //     case REFRESH_STATE.loading:
        //       return (
        //         <div className={cls}>
        //           <ActivityIndicator type="spinner" />
        //           <span>加载中</span>
        //         </div>
        //       );

        //     case REFRESH_STATE.success:
        //       return (
        //         <div className={cls}>
        //           <Icon type="right-round" theme="success" />
        //           <span>加载成功</span>
        //         </div>
        //       );

        //     case REFRESH_STATE.failure:
        //       return (
        //         <div className={cls}>
        //           <Icon type="wrong-round" theme="danger" />
        //           <span>加载失败</span>
        //         </div>
        //       );

        //     default:
        //   }
        // },
      }}
    >
      <div className={styles.root}>
        {loading && <span>loading</span>}
        {children && !loading ? <div className={styles.content}>{children}</div> : null}
      </div>
    </Pull>
  );
};
export default BasicContentLayout;
