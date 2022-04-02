import { t } from 'i18next';
import React, { useMemo } from 'react';
import { Box, Grid } from '@material-ui/core';
import PieChart from 'components/Charts/PieChart';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { useAppSelector } from 'redux/store';
import { selectAllocationRateTopup, selectTotalTopup } from 'redux/features/report/slice';
import { CURRENCY_TYPE, getMethodType } from 'utils/constant/payment';
import { formatCurrency } from 'utils/common';

type Props = {};

const AllocationRateWithdraw = (props: Props) => {
  const topupAllocationRate = useAppSelector(selectAllocationRateTopup);
  const topupTotal = useAppSelector(selectTotalTopup);

  const chartData = useMemo(
    () =>
      topupAllocationRate.topUpAllocationRateList.map((item) => ({
        name: getMethodType(item.method)?.name || '-',
        y: item.percent,
        value: item.amount,
      })),
    [topupAllocationRate],
  );

  return (
    <Paper radius={PaperRadius.max} style={{ height: '100%' }}>
      <Box p={4}>
        <Grid container direction="column">
          <Grid item>
            <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
              {t('Top-up Allocation Rate')}
            </Typography>
          </Grid>
          {/* total */}
          <Grid item>
            <Box py={2}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs="auto">
                  <Typography type={TypoTypes.titleSub} variant={TypoVariants.body1}>
                    {t('Total')} {t('Top-up')}:
                  </Typography>
                </Grid>
                <Grid item xs="auto">
                  <Typography type={TypoTypes.secondary} variant={TypoVariants.head1} weight={TypoWeights.bold}>
                    {formatCurrency(topupTotal)} VND
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {/* total */}
          {/* pie chart */}
          <Grid item>
            <PieChart data={chartData} type={CURRENCY_TYPE.VND} />
          </Grid>
          {/* pie chart */}
        </Grid>
      </Box>
    </Paper>
  );
};

export default React.memo(AllocationRateWithdraw);
