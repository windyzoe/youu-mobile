import React from 'react';
import styles from './CircleIcon.less';

const CircleIcon: React.FC<{ color?: string }> = ({ children, color }) => {
  return <div className={styles.root}>{children}</div>;
};

export default CircleIcon;
