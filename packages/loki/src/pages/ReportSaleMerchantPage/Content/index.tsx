import { Grid } from '@material-ui/core';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import { PaymentType } from '@mcuc/stark/stark_pb';
import { SaleReportItem } from '@mcuc/stark/howard_pb';
import _uniqBy from 'lodash-es/uniqBy';

import { useAppSelector } from 'redux/store';
import {
  selectSaleReportByMerchantTopUpList,
  selectSaleReportByMerchantTotalList,
  selectSaleReportByMerchantWithdrawList,
} from 'redux/features/saleReport/slice';
import { selectMerchantEntities } from 'redux/features/merchants/slice';

import AlopayTable from 'components/AlopayTable';
import BarChart from 'components/Charts/BarChart';
import LayoutPaper from 'components/Layout/LayoutPaper';

import { formatCurrency } from 'utils/common';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';

import FilterByMerchant from '../components/FilterByMerchant';
import { Tab } from '../types';

const Content: React.FC = () => {
  const [urlParams] = useUpdateUrlParams();
  const { tab: tabParam = Tab.VND } = urlParams;
  const currencyType = +tabParam === Tab.VND ? CURRENCY_TYPE.VND : CURRENCY_TYPE.USDT;

  const merchantMap = useAppSelector(selectMerchantEntities);
  const topupList = useAppSelector(selectSaleReportByMerchantTopUpList);
  const withdrawList = useAppSelector(selectSaleReportByMerchantWithdrawList);
  const totalList = useAppSelector(selectSaleReportByMerchantTotalList);

  const categoriesChart = useMemo(
    () => _uniqBy([...topupList, ...withdrawList], 'merchantId'),
    [topupList, withdrawList],
  );

  const topupByMerchantIdMap = useMemo(
    () =>
      topupList.reduce((acc, item) => {
        acc[item.merchantId] = item;
        return acc;
      }, {} as Record<string, SaleReportItem.AsObject>),
    [topupList],
  );

  const withdrawByMerchantIdMap = useMemo(
    () =>
      withdrawList.reduce((acc, item) => {
        acc[item.merchantId] = item;
        return acc;
      }, {} as Record<string, SaleReportItem.AsObject>),
    [withdrawList],
  );

  const columns = useMemo(
    () => (payment: PaymentType.TOPUP | PaymentType.WITHDRAW) =>
      [
        {
          Header: t('Merchant'),
          accessor: (row: SaleReportItem.AsObject) => merchantMap[row.merchantId]?.name,
          Footer: () => t('Total'),
        },
        {
          Header: `${t('Quantity')} (${t('Count')})`,
          accessor: (row: SaleReportItem.AsObject) => formatCurrency(row.quantity),
          Footer: () => formatCurrency(totalList[payment].totalQuantity),
        },
        {
          Header: `${t('Amount')} (${currencyType})`,
          accessor: (row: SaleReportItem.AsObject) => formatCurrency(row.amount),
          Footer: () => formatCurrency(totalList[payment].totalAmount),
        },
        {
          Header: `${t('Average')} (${currencyType})`,
          accessor: (row: SaleReportItem.AsObject) => formatCurrency(row.average),
          Footer: () => formatCurrency(totalList[payment].totalAverage),
        },
        {
          Header: `${t('Discount')} (${currencyType})`,
          accessor: (row: SaleReportItem.AsObject) => formatCurrency(row.discount),
          Footer: () => formatCurrency(totalList[payment].totalDiscount),
        },
        {
          Header: `${t('Revenue')} (${currencyType})`,
          accessor: (row: SaleReportItem.AsObject) => formatCurrency(row.revenue),
          Footer: () => formatCurrency(totalList[payment].totalRevenue),
        },
      ],
    [currencyType, merchantMap, totalList],
  );

  const columnsTopup = columns(PaymentType.TOPUP);
  const columnsWithdraw = columns(PaymentType.WITHDRAW);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <LayoutPaper header={uppercaseFirstLetterAllWords(t('Total sale'))} actions={<FilterByMerchant />}>
            <BarChart
              currencyType={currencyType}
              categories={categoriesChart.map((item) => merchantMap[item.merchantId]?.name)}
              series={[
                {
                  name: t('Top-Up'),
                  data: categoriesChart.map((item) => topupByMerchantIdMap[item.merchantId]?.amount || 0),
                },
                {
                  name: t('Withdraw'),
                  data: categoriesChart.map((item) => withdrawByMerchantIdMap[item.merchantId]?.amount || 0),
                },
              ]}
            />
          </LayoutPaper>
        </Grid>
        <Grid item xs={12}>
          <LayoutPaper header={t('Top-Up Data')}>
            <AlopayTable columns={columnsTopup} data={topupList} />
          </LayoutPaper>
        </Grid>
        <Grid item xs={12}>
          <LayoutPaper header={t('Withdraw Data')}>
            <AlopayTable columns={columnsWithdraw} data={withdrawList} />
          </LayoutPaper>
        </Grid>
      </Grid>
    </>
  );
};

export default Content;
