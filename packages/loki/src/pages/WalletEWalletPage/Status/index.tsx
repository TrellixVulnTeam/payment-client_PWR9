import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import styles from './styles.module.scss';
import cn from 'classnames';
import { t } from 'i18next';

interface Props {
  status: number;
}

const Status = (props: Props) => {
  const { status } = { ...props };
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs="auto">
        <div
          className={cn(styles['dot'], {
            [styles['active']]: status === 1,
            [styles['inactive']]: status === 0,
          })}
        />
      </Grid>
      <Grid item xs="auto">
        <Typography variant="subtitle1">{status === 0 ? t('Inactive') : t('Active')}</Typography>
      </Grid>
    </Grid>
  );
};

export default Status;
