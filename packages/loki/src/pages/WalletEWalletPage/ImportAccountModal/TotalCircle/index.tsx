import cn from 'classnames';
import Typography, { TypoTypes, TypoWeights } from 'components/StyleGuide/Typography';
import React from 'react';
import styles from './styles.module.scss';

interface Props {
  type?: TypoTypes;
  label: string | number;
}

const defaultProps = {
  type: TypoTypes.success,
  label: 1,
};

const TotalCircle = (props: Props) => {
  const { label, type } = { ...defaultProps, ...props };
  return (
    <div className={cn(styles['root'], styles[`type-${type}`])}>
      <Typography type={type} weight={TypoWeights.bold}>
        {label}
      </Typography>
    </div>
  );
};

export default TotalCircle;
