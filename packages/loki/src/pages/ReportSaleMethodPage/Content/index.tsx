import { PaymentType } from '@mcuc/stark/stark_pb';
import { SaleReportItem } from '@mcuc/stark/howard_pb';
import { t } from 'i18next';
import { Grid } from '@material-ui/core';
import React, { useMemo } from 'react';

import {
  selectSaleReportByPaymentMethodTopUpList,
  selectSaleReportByPaymentMethodTotalList,
  selectSaleReportByPaymentMethodWithdrawList,
} from 'redux/features/saleReport/slice';
import { useAppSelector } from 'redux/store';
import BarChart from 'components/Charts/BarChart';
import LayoutPaper from 'components/Layout/LayoutPaper';
import AlopayTable from 'components/AlopayTable';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { formatCurrency } from 'utils/common';
import { CURRENCY_TYPE, getMethodType } from 'utils/constant/payment';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';
import StatisticBox from '../components/StaticBox';
import { Tab } from '../types';

const Content: React.FC = () => {
  const [urlParams] = useUpdateUrlParams();
  const { tab: tabParam = Tab.VND } = urlParams;

  const currencyType = +tabParam === Tab.VND ? CURRENCY_TYPE.VND : CURRENCY_TYPE.USDT;

  const topupList = useAppSelector(selectSaleReportByPaymentMethodTopUpList);
  const withdrawList = useAppSelector(selectSaleReportByPaymentMethodWithdrawList);
  const totalList = useAppSelector(selectSaleReportByPaymentMethodTotalList);

  const columns = useMemo(
    () => (payment: PaymentType.TOPUP | PaymentType.WITHDRAW) =>
      [
        {
          Header: t('Merchant'),
          accessor: (row: SaleReportItem.AsObject) => getMethodType(row.paymentMethod)?.name,
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
    [currencyType, totalList],
  );

  const columnsTopup = columns(PaymentType.TOPUP);
  const columnsWithdraw = columns(PaymentType.WITHDRAW);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <LayoutPaper header={uppercaseFirstLetterAllWords(t('Total sale'))}>
            <BarChart
              currencyType={currencyType}
              categories={topupList.map((item) => getMethodType(item.paymentMethod)?.name)}
              series={[
                {
                  name: t('Top-Up'),
                  data: topupList.map((item) => item.amount),
                },
                {
                  name: t('Withdraw'),
                  data: withdrawList.map((item) => item.amount),
                },
              ]}
            />
          </LayoutPaper>
        </Grid>
        {+tabParam === Tab.VND && (
          <>
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
          </>
        )}
        {+tabParam === Tab.USDT && (
          <>
            <Grid item xs={12}>
              <LayoutPaper header={t('Top-Up Data')}>
                <Grid container spacing={3}>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Quantity'),
                        unit: t('Count'),
                        value: totalList[PaymentType.TOPUP].totalQuantity,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Amount'),
                        unit: CURRENCY_TYPE.USDT,
                        value: totalList[PaymentType.TOPUP].totalAmount,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Average'),
                        unit: CURRENCY_TYPE.USDT,
                        value: totalList[PaymentType.TOPUP].totalAverage,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Discount'),
                        unit: CURRENCY_TYPE.USDT,
                        value: totalList[PaymentType.TOPUP].totalDiscount,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Revenue'),
                        unit: CURRENCY_TYPE.USDT,
                        value: totalList[PaymentType.TOPUP].totalRevenue,
                      }}
                    />
                  </Grid>
                </Grid>
              </LayoutPaper>
            </Grid>
            <Grid item xs={12}>
              <LayoutPaper header={t('Withdraw Data')}>
                <Grid container spacing={3}>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Quantity'),
                        unit: t('Count'),
                        value: totalList[PaymentType.TOPUP].totalQuantity,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Amount'),
                        unit: CURRENCY_TYPE.USDT,
                        value: totalList[PaymentType.TOPUP].totalAmount,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Average'),
                        unit: CURRENCY_TYPE.USDT,
                        value: totalList[PaymentType.TOPUP].totalAverage,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Discount'),
                        unit: CURRENCY_TYPE.USDT,
                        value: totalList[PaymentType.TOPUP].totalDiscount,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} lg>
                    <StatisticBox
                      data={{
                        title: t('Revenue'),
                        unit: CURRENCY_TYPE.USDT,
                        value: totalList[PaymentType.TOPUP].totalRevenue,
                      }}
                    />
                  </Grid>
                </Grid>
              </LayoutPaper>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default Content;
