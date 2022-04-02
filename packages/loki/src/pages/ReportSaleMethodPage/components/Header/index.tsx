import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';
import { PaymentType } from '@mcuc/stark/stark_pb';

import { PeriodType } from 'context/url_params_context/resolve_url_params';
import { useAppSelector } from 'redux/store';
import {
  selectSaleReportByPaymentMethodTopUpList,
  selectSaleReportByPaymentMethodTotalList,
  selectSaleReportByPaymentMethodWithdrawList,
} from 'redux/features/saleReport/slice';
import { useMemo } from 'react';
import ButtonExportCSV from 'components/ButtonExportExcel';
import Grid from 'components/StyleGuide/Grid';
import DateRange from 'components/DateRange';
import Typography, { TypoWeights, TypoVariants } from 'components/StyleGuide/Typography';
import { getMethodType } from 'utils/constant/payment';

interface Props {}

const HeaderActions = (props: Props) => {
  const { t } = useTranslation();
  const topUpsList = useAppSelector(selectSaleReportByPaymentMethodTopUpList);
  const withdrawsList = useAppSelector(selectSaleReportByPaymentMethodWithdrawList);
  const totalList = useAppSelector(selectSaleReportByPaymentMethodTotalList);

  const csvData = useMemo(
    () => [
      {
        sheetName: t('Top-Up'),
        header: ['method', 'quantity', 'amount', 'average', 'discount', 'revenue'],
        heading: [
          {
            method: t('Method'),
            quantity: t('Quantity'),
            amount: t('Amount'),
            average: t('Average'),
            discount: t('Discount'),
            revenue: t('Revenue'),
          },
        ],
        data: [
          ...topUpsList.map((item) => ({
            method: getMethodType(item.paymentMethod)?.name || '-',
            quantity: item.quantity,
            amount: item.amount,
            average: item.average,
            discount: item.discount,
            revenue: item.revenue,
          })),
          {
            method: t('Total'),
            quantity: totalList[PaymentType.TOPUP].totalQuantity,
            amount: totalList[PaymentType.TOPUP].totalAmount,
            average: totalList[PaymentType.TOPUP].totalAverage,
            discount: totalList[PaymentType.TOPUP].totalDiscount,
            revenue: totalList[PaymentType.TOPUP].totalRevenue,
          },
        ],
      },
      {
        sheetName: t('Withdraw'),
        header: ['method', 'quantity', 'amount', 'average', 'discount', 'revenue'],
        heading: [
          {
            method: t('Method'),
            quantity: t('Quantity'),
            amount: t('Amount'),
            average: t('Average'),
            discount: t('Discount'),
            revenue: t('Revenue'),
          },
        ],
        data: [
          ...withdrawsList.map((item) => ({
            method: getMethodType(item.paymentMethod)?.name || '-',
            quantity: item.quantity,
            amount: item.amount,
            average: item.average,
            discount: item.discount,
            revenue: item.revenue,
          })),
          {
            method: t('Total'),
            quantity: totalList[PaymentType.WITHDRAW].totalQuantity,
            amount: totalList[PaymentType.WITHDRAW].totalAmount,
            average: totalList[PaymentType.WITHDRAW].totalAverage,
            discount: totalList[PaymentType.WITHDRAW].totalDiscount,
            revenue: totalList[PaymentType.WITHDRAW].totalRevenue,
          },
        ],
      },
    ],
    [t, topUpsList, withdrawsList, totalList],
  );

  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <Grid item xs="auto">
        <Typography weight={TypoWeights.bold} variant={TypoVariants.head1}>
          {t('Method')}
        </Typography>
      </Grid>
      <Grid item xs="auto">
        <Box display="flex">
          <Box mr={1.5}>
            <DateRange defaultPeriod={PeriodType.Last7Days} />
          </Box>
          <Box>
            <ButtonExportCSV csvData={csvData} fileName={'Report Sale Method'} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HeaderActions;
