import { t } from 'i18next';
import React from 'react';
import { Box, Grid } from '@material-ui/core';
import LayoutPaper from 'components/Layout/LayoutPaper';
import { PaperBackgrounds } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import StatisticBox from '../StatisticBox';
import { useAppSelector } from 'redux/store';
import { selectPaymentTodayTopup, selectPaymentTodayWithdraw } from 'redux/features/report/slice';
import { useCountUp } from 'use-count-up';

type Props = {};

const PaymentToday = (props: Props) => {
  const topup = useAppSelector(selectPaymentTodayTopup);
  const withdraw = useAppSelector(selectPaymentTodayWithdraw);

  const { value: topupCompleted } = useCountUp({
    isCounting: true,
    end: topup.completed,
    duration: 1,
    thousandsSeparator: '.',
  });

  const { value: withdrawCompleted } = useCountUp({
    isCounting: true,
    end: withdraw.completed,
    duration: 1,
    thousandsSeparator: '.',
  });

  return (
    <LayoutPaper header={t('Payment today')} style={{ height: '488px' }}>
      <Grid container direction="column">
        <Grid item>
          <Box mb={3}>
            <StatisticBox
              background={PaperBackgrounds.ghost}
              title={
                <Box display="flex" justifyContent="center" mb={3}>
                  <Typography variant={TypoVariants.head3} weight={TypoWeights.bold}>
                    {t('Top-up')}
                  </Typography>
                </Box>
              }
              value={
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                  <Box display="flex" flexDirection="column" alignItems="center" width={173}>
                    <Box mb={1}>
                      <Typography variant={TypoVariants.head1} weight={TypoWeights.bold} type={TypoTypes.secondary}>
                        {topupCompleted}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant={TypoVariants.head4} weight={TypoWeights.bold} type={TypoTypes.sub}>
                        {t('Completed')}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant={TypoVariants.head1} weight={TypoWeights.bold} type={TypoTypes.secondary}>
                      /
                    </Typography>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center" width={173}>
                    <Box mb={1}>
                      <Typography variant={TypoVariants.head1} weight={TypoWeights.bold} type={TypoTypes.secondary}>
                        {topup.total}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant={TypoVariants.head4} weight={TypoWeights.bold} type={TypoTypes.sub}>
                        {t('Total')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              }
            />
          </Box>
        </Grid>
        <Grid item>
          <StatisticBox
            background={PaperBackgrounds.ghost}
            title={
              <Box mb={3} display="flex" justifyContent="center">
                <Typography variant={TypoVariants.head3} weight={TypoWeights.bold}>
                  {t('Withdraw')}
                </Typography>
              </Box>
            }
            value={
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <Box display="flex" flexDirection="column" alignItems="center" width={173}>
                  <Box mb={1}>
                    <Typography variant={TypoVariants.head1} weight={TypoWeights.bold} type={TypoTypes.secondary}>
                      {withdrawCompleted}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant={TypoVariants.head4} weight={TypoWeights.bold} type={TypoTypes.sub}>
                      {t('Completed')}
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant={TypoVariants.head1} weight={TypoWeights.bold} type={TypoTypes.secondary}>
                    /
                  </Typography>
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center" width={173}>
                  <Box mb={1}>
                    <Typography variant={TypoVariants.head1} weight={TypoWeights.bold} type={TypoTypes.secondary}>
                      {withdraw.total}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant={TypoVariants.head4} weight={TypoWeights.bold} type={TypoTypes.sub}>
                      {t('Total')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            }
          />
        </Grid>
      </Grid>
    </LayoutPaper>
  );
};

export default React.memo(PaymentToday);
