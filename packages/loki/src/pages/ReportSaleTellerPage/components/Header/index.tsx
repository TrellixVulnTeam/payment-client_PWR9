import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';
import { PaymentType } from '@mcuc/stark/stark_pb';
import { useMemo } from 'react';

import { useAppSelector } from 'redux/store';
import {
  selectSaleReportByTellerTopUpList,
  selectSaleReportByTellerTotalList,
  selectSaleReportByTellerWithdrawList,
} from 'redux/features/saleReport/slice';
import DateRange from 'components/DateRange';
import Grid from 'components/StyleGuide/Grid';
import Typography, { TypoWeights, TypoVariants } from 'components/StyleGuide/Typography';
import ButtonExportCSV from 'components/ButtonExportExcel';
import { PeriodType } from 'context/url_params_context/resolve_url_params';
import { selectUsersMap } from 'redux/features/common/slice';

interface Props {}

const HeaderActions = (props: Props) => {
  const { t } = useTranslation();
  const usersMap = useAppSelector(selectUsersMap);
  const topUpsList = useAppSelector(selectSaleReportByTellerTopUpList);
  const withdrawsList = useAppSelector(selectSaleReportByTellerWithdrawList);
  const totalList = useAppSelector(selectSaleReportByTellerTotalList);

  const csvData = useMemo(
    () => [
      {
        sheetName: t('Top-Up'),
        header: ['teller', 'quantity', 'amount', 'average', 'discount', 'revenue'],
        heading: [
          {
            teller: t('Teller'),
            quantity: t('Quantity'),
            amount: t('Amount'),
            average: t('Average'),
            discount: t('Discount'),
            revenue: t('Revenue'),
          },
        ],
        data: [
          ...topUpsList.map((item) => ({
            teller: usersMap[item.tellerId]?.displayName || '-',
            quantity: item.quantity,
            amount: item.amount,
            average: item.average,
            discount: item.discount,
            revenue: item.revenue,
          })),
          {
            teller: t('Total'),
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
        header: ['teller', 'quantity', 'amount', 'average', 'discount', 'revenue'],
        heading: [
          {
            teller: t('Teller'),
            quantity: t('Quantity'),
            amount: t('Amount'),
            average: t('Average'),
            discount: t('Discount'),
            revenue: t('Revenue'),
          },
        ],
        data: [
          ...withdrawsList.map((item) => ({
            teller: usersMap[item.tellerId]?.displayName || '-',
            quantity: item.quantity,
            amount: item.amount,
            average: item.average,
            discount: item.discount,
            revenue: item.revenue,
          })),
          {
            teller: t('Total'),
            quantity: totalList[PaymentType.WITHDRAW].totalQuantity,
            amount: totalList[PaymentType.WITHDRAW].totalAmount,
            average: totalList[PaymentType.WITHDRAW].totalAverage,
            discount: totalList[PaymentType.WITHDRAW].totalDiscount,
            revenue: totalList[PaymentType.WITHDRAW].totalRevenue,
          },
        ],
      },
    ],
    [t, usersMap, topUpsList, withdrawsList, totalList],
  );

  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <Grid item xs="auto">
        <Typography weight={TypoWeights.bold} variant={TypoVariants.head1}>
          {t('Teller')}
        </Typography>
      </Grid>
      <Grid item xs="auto">
        <Box display="flex">
          <Box mr={1.5}>
            <DateRange defaultPeriod={PeriodType.Last7Days} />
          </Box>
          <Box>
            <ButtonExportCSV csvData={csvData} fileName={'Report Sale Teller'} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HeaderActions;
