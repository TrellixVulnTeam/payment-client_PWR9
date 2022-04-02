import React from 'react';
import styles from './styles.module.scss';

const TopBar = ({ children }: any): any => (
  <div className={styles.root}>{children}</div>
);

export default TopBar;
