import { t } from 'i18next';
import React, { useMemo } from 'react';
import { Box, Grid } from '@material-ui/core';
import PieChart from 'components/Charts/PieChart';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { selectAllocationRateWithdraw, selectTotalWithdraw } from 'redux/features/report/slice';
import { useAppSelector } from 'redux/store';
import { CURRENCY_TYPE, getMethodType } from 'utils/constant/payment';
import { formatCurrency } from 'utils/common';

interface Props {}

const AllocationRateWithdraw = (props: Props) => {
  const withdrawAllocationRate = useAppSelector(selectAllocationRateWithdraw);
  const totalWithdraw = useAppSelector(selectTotalWithdraw);

  const chartData = useMemo(
    () =>
      withdrawAllocationRate.withdrawAllocationRateList.map((item) => ({
        name: getMethodType(item.method)?.name || '-',
        y: item.percent,
        value: item.amount,
      })),
    [withdrawAllocationRate],
  );
  return (
    <Paper radius={PaperRadius.max} style={{ height: '100%' }}>
      <Box p={4}>
        <Grid container direction="column">
          <Grid item>
            <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
              {t('Withdraw Allocation Rate')}
            </Typography>
          </Grid>
          {/* total */}
          <Grid item>
            <Box py={2}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs="auto">
                  <Typography type={TypoTypes.titleSub} variant={TypoVariants.body1}>
                    {t('Total')} {t('Withdraw')}:
                  </Typography>
                </Grid>
                <Grid item xs="auto">
                  <Typography type={TypoTypes.secondary} variant={TypoVariants.head1} weight={TypoWeights.bold}>
                    {formatCurrency(totalWithdraw)} VND
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
