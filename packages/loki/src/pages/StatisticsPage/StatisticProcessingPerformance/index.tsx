import { Box, Grid } from '@material-ui/core';
import PieChart from 'components/Charts/PieChart';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { t } from 'i18next';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectProcessingPerformance } from 'redux/features/statistics/slice';
import { useCountUp } from 'use-count-up';
import Filter from './Filter';

interface Props {}

const StatisticProcessPerformance = (props: Props) => {
  const processingPerformance = useSelector(selectProcessingPerformance);

  const defaultData = [
    {
      name: 'Successfully',
      y: Math.round(processingPerformance?.successfully?.percent * 100) / 100,
      value: processingPerformance?.successfully?.number,
    },
    {
      name: 'Failed',
      y: Math.round(processingPerformance?.failed?.percent * 100) / 100,
      value: processingPerformance?.failed?.number,
    },
    {
      name: 'Waiting',
      y: Math.round(processingPerformance?.waiting?.percent * 100) / 100,
      value: processingPerformance?.waiting?.number,
    },
  ];

  const { value: totalOrder } = useCountUp({
    isCounting: true,
    end: processingPerformance?.totalOrder,
    duration: 1,
    thousandsSeparator: '.',
  });

  return (
    <Paper radius={PaperRadius.max}>
      <Box p={4}>
        <Grid container direction="column">
          <Grid item xs={12}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item xs="auto">
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
                      {t('Processing performance')}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography type={TypoTypes.titleSub} weight={TypoWeights.light} variant={TypoVariants.body1}>
                      {t('Last {{day}} days', { day: 7 })}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={4}>
                <Filter />
              </Grid>
            </Grid>
          </Grid>
          {/* total */}
          <Grid item xs={12}>
            <Box mt={4}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs="auto">
                  <Typography type={TypoTypes.titleSub} weight={TypoWeights.light} variant={TypoVariants.body1}>
                    {t('Total order (count)')}:
                  </Typography>
                </Grid>
                <Grid item xs="auto">
                  <Typography variant={TypoVariants.head1} weight={TypoWeights.bold} type={TypoTypes.secondary}>
                    {totalOrder}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* total */}
          {/* pie chart */}
          <Grid item xs={12}>
            <PieChart data={defaultData} type={t('Orders')} />
          </Grid>
          {/* pie chart */}
        </Grid>
      </Box>
    </Paper>
  );
};

export default React.memo(StatisticProcessPerformance);
