import { Box, Grid } from '@material-ui/core';
import Divider from 'components/StyleGuide/Divider';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectTopupStatistics, selectWithdrawStatistics } from 'redux/features/statistics/slice';
import Filter from './Filter';
import StatisticPaymentRow from './StatisticPaymentRow';

interface Props {}

const StatisticPayment = (props: Props) => {
  const { t } = useTranslation();

  const topupStatistics = useSelector(selectTopupStatistics);
  const withdrawStatistics = useSelector(selectWithdrawStatistics);

  return (
    <Paper radius={PaperRadius.max}>
      <Box p={4}>
        <Grid container direction="column" spacing={3}>
          {/* heading */}
          <Grid item>
            <Grid container justifyContent="space-between">
              <Grid item xs="auto">
                <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
                  {t('Statistics of payment')}
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <Filter />
              </Grid>
            </Grid>
          </Grid>
          {/* heading */}
          <Grid item>
            <Grid container direction="column" spacing={3}>
              {/* top-up */}
              <Grid item>
                <StatisticPaymentRow title={t('Top-up')} data={topupStatistics} />
              </Grid>
              {/* top-up */}
              <Grid item>
                <Divider />
              </Grid>
              {/* Withdraw */}
              <Grid item>
                <StatisticPaymentRow title={t('Withdraw')} data={withdrawStatistics} />
              </Grid>
              {/* Withdraw */}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default StatisticPayment;
