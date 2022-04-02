import { t } from 'i18next';
import { PaymentMethodRevenue } from '@mcuc/vision/vision_pb';
import React from 'react';
import { useAppSelector } from 'redux/store';
import { selectTopupPaymentMethod } from 'redux/features/report/slice';

import { Box, Grid } from '@material-ui/core';

import AlopayTable from 'components/AlopayTable';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

import { formatCurrency } from 'utils/common';
import { getMethodType, getPaymentType, CURRENCY_TYPE } from 'utils/constant/payment';

const columns = [
  {
    Header: t('Product name'),
    accessor: (row: PaymentMethodRevenue.AsObject) => {
      const paymentType = getPaymentType(row.type)?.name;
      const methodType = getMethodType(row.method)?.name;
      return (
        <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}>
          {paymentType} {methodType}
        </Typography>
      );
    },
  },
  {
    Header: `${t('Total Revenue')} (${CURRENCY_TYPE.VND})`,
    accessor: (row: PaymentMethodRevenue.AsObject) => formatCurrency(row.amount),
  },
];

interface Props {}

const TopPaymentMethod = (props: Props) => {
  const topupPaymentMethod = useAppSelector(selectTopupPaymentMethod);

  return (
    <Paper radius={PaperRadius.max} style={{ height: '100%' }}>
      <Box p={4}>
        {/*  HEADER */}
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
              {t('Top Payment Method')}
            </Typography>
          </Grid>
          {/* CONTENT */}
          <Grid item>
            <Box py={2}>
              <AlopayTable columns={columns} data={topupPaymentMethod.topPaymentMethodRevenueList} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default React.memo(TopPaymentMethod);
