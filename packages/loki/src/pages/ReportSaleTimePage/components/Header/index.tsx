import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';
import { PaymentType } from '@mcuc/stark/stark_pb';

import { useAppSelector } from 'redux/store';
import {
  selectSaleReportByTimeRangeTopUpList,
  selectSaleReportByTimeRangeTotalList,
  selectSaleReportByTimeRangeWithdrawList,
} from 'redux/features/saleReport/slice';

import DateRange from 'components/DateRange';
import Grid from 'components/StyleGuide/Grid';
import ButtonExportCSV from 'components/ButtonExportExcel';
import Typography, { TypoWeights, TypoVariants } from 'components/StyleGuide/Typography';
import { PeriodType } from 'context/url_params_context/resolve_url_params';
import { formatDate } from 'utils/date';

interface Props {}

const HeaderActions = (props: Props) => {
  const { t } = useTranslation();
  const topUpsList = useAppSelector(selectSaleReportByTimeRangeTopUpList);
  const withdrawsList = useAppSelector(selectSaleReportByTimeRangeWithdrawList);
  const totalList = useAppSelector(selectSaleReportByTimeRangeTotalList);

  const csvData = useMemo(
    () => [
      {
        sheetName: t('Top-Up'),
        header: ['date', 'quantity', 'amount', 'average', 'discount', 'revenue'],
        heading: [
          {
            date: t('Date'),
            quantity: t('Quantity'),
            amount: t('Amount'),
            average: t('Average'),
            discount: t('Discount'),
            revenue: t('Revenue'),
          },
        ],
        data: [
          ...Object.values(topUpsList).map((item) => ({
            ...item,
            date: formatDate((item.date as any).seconds * 1000),
          })),
          {
            date: t('Total'),
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
        header: ['date', 'quantity', 'amount', 'average', 'discount', 'revenue'],
        heading: [
          {
            date: t('Date'),
            quantity: t('Quantity'),
            amount: t('Amount'),
            average: t('Average'),
            discount: t('Discount'),
            revenue: t('Revenue'),
          },
        ],
        data: [
          ...Object.values(withdrawsList).map((item) => ({
            ...item,
            date: formatDate((item.date as any).seconds * 1000),
          })),
          {
            date: t('Total'),
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
          {t('Time')}
        </Typography>
      </Grid>
      <Grid item xs="auto">
        <Box display="flex">
          <Box mr={1.5}>
            <DateRange defaultPeriod={PeriodType.Last7Days} />
          </Box>
          <Box>
            <ButtonExportCSV csvData={csvData} fileName={'Report Sale Time'} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HeaderActions;
