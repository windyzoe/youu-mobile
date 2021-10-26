import React from 'react';
import styles from './index.less';

/**
 * @description 当前网站的logo
 * @date 2020-11-13
 * @param { hiddenTitle } 是否隐藏logo
 * @returns
 */
const Logo: React.FC<{ hiddenTitle: boolean }> = ({ hiddenTitle }) => {
  return (
    <div className={styles.root}>
      {!hiddenTitle && <div style={{ textIndent: '1rem', letterSpacing: '0.15rem' }}>YOUUUI</div>}
    </div>
  );
};

export default Logo;
