import { Box, Grid } from '@material-ui/core';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { t } from 'i18next';
import _isEmpty from 'lodash-es/isEmpty';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { useGetTotalAmountFetcher } from '../hooks/useGetTotalAmountFetcher';
import FilterByMerchant from './FilterByMerchant';
import styles from './styles.module.scss';
import TotalAmountChart from './TotalAmountChart';

interface Props {}

const StatisticTotalAmount = (props: Props) => {
  const merchants = useSelector(selectDisplayMerchants);
  useGetTotalAmountFetcher();

  return (
    <Paper radius={PaperRadius.max} className={styles['root']}>
      <Box p={4}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
              <Grid item xs="auto">
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
                      {t('Total amount')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography type={TypoTypes.titleSub} variant={TypoVariants.body1}>
                      {t('Last {{day}} days', { day: 7 })}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                {!_isEmpty(merchants) && <FilterByMerchant />}
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <TotalAmountChart />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default StatisticTotalAmount;
