import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';
import { PaymentType } from '@mcuc/stark/stark_pb';
import { useMemo } from 'react';

import { useAppSelector } from 'redux/store';
import {
  selectSaleReportByMerchantTopUpList,
  selectSaleReportByMerchantTotalList,
  selectSaleReportByMerchantWithdrawList,
} from 'redux/features/saleReport/slice';
import { selectMerchantEntities } from 'redux/features/merchants/slice';

import DateRange from 'components/DateRange';
import Grid from 'components/StyleGuide/Grid';
import ButtonExportCSV from 'components/ButtonExportExcel';
import Typography, { TypoWeights, TypoVariants } from 'components/StyleGuide/Typography';
import { PeriodType } from 'context/url_params_context/resolve_url_params';

interface Props {}

const HeaderActions = (props: Props) => {
  const { t } = useTranslation();
  const topUpsList = useAppSelector(selectSaleReportByMerchantTopUpList);
  const withdrawsList = useAppSelector(selectSaleReportByMerchantWithdrawList);
  const totalList = useAppSelector(selectSaleReportByMerchantTotalList);
  const merchantMap = useAppSelector(selectMerchantEntities);

  const csvData = useMemo(
    () => [
      {
        sheetName: t('Top-Up'),
        header: ['merchant', 'quantity', 'amount', 'average', 'discount', 'revenue'],
        heading: [
          {
            merchant: t('Merchant'),
            quantity: t('Quantity'),
            amount: t('Amount'),
            average: t('Average'),
            discount: t('Discount'),
            revenue: t('Revenue'),
          },
        ],
        data: [
          ...topUpsList.map((item) => ({
            merchant: merchantMap[item.merchantId]?.name || '-',
            quantity: item.quantity,
            amount: item.amount,
            average: item.average,
            discount: item.discount,
            revenue: item.revenue,
          })),
          {
            merchant: t('Total'),
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
        header: ['merchant', 'quantity', 'amount', 'average', 'discount', 'revenue'],
        heading: [
          {
            merchant: t('Merchant'),
            quantity: t('Quantity'),
            amount: t('Amount'),
            average: t('Average'),
            discount: t('Discount'),
            revenue: t('Revenue'),
          },
        ],
        data: [
          ...withdrawsList.map((item) => ({
            merchant: merchantMap[item.merchantId]?.name || '-',
            quantity: item.quantity,
            amount: item.amount,
            average: item.average,
            discount: item.discount,
            revenue: item.revenue,
          })),
          {
            merchant: t('Total'),
            quantity: totalList[PaymentType.WITHDRAW].totalQuantity,
            amount: totalList[PaymentType.WITHDRAW].totalAmount,
            average: totalList[PaymentType.WITHDRAW].totalAverage,
            discount: totalList[PaymentType.WITHDRAW].totalDiscount,
            revenue: totalList[PaymentType.WITHDRAW].totalRevenue,
          },
        ],
      },
    ],
    [t, topUpsList, withdrawsList, totalList, merchantMap],
  );

  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <Grid item xs="auto">
        <Typography weight={TypoWeights.bold} variant={TypoVariants.head1}>
          {t('Merchant')}
        </Typography>
      </Grid>
      <Grid item xs="auto">
        <Box display="flex">
          <Box mr={1.5}>
            <DateRange defaultPeriod={PeriodType.Last7Days} />
          </Box>
          <Box>
            <ButtonExportCSV csvData={csvData} fileName={'Report Sale Merchant'} />
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default HeaderActions;
