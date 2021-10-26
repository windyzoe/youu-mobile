import React, { PureComponent } from 'react';
import styles from './index.less';

/**
 *CSS实现的loading画面
 *
 * @class SquareLoading
 * @extends {PureComponent}
 */
class PageLoading extends PureComponent {
  render() {
    return (
      <div className={styles.preloader}>
        <div />
      </div>
    );
  }
}
export const StaticLoading = () => <div style={{ padding: '2%' }}>StaticLoading</div>;

export default PageLoading;
