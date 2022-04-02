import Loading from 'assets/icons/ILT/lib/Loading';
import Icon from 'components/StyleGuide/Icon';
import React from 'react';
import styles from './styles.module.scss';

interface Props {}

const Spinning = (props: Props) => {
  return <Icon className={styles['loading']} component={Loading} />;
};

export default Spinning;
