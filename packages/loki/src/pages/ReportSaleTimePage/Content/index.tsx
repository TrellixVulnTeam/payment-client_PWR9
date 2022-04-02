import React, { useMemo } from 'react';
import { t } from 'i18next';
import { Grid } from '@material-ui/core';
import { SaleReportItem } from '@mcuc/stark/howard_pb';
import { PaymentType } from '@mcuc/stark/stark_pb';
import _uniq from 'lodash-es/uniq';

import BarChart from 'components/Charts/BarChart';
import LayoutPaper from 'components/Layout/LayoutPaper';
import AlopayTable from 'components/AlopayTable';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { formatCurrency } from 'utils/common';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';
import { useAppSelector } from 'redux/store';
import {
  selectSaleReportByTimeRangeTopUpList,
  selectSaleReportByTimeRangeTotalList,
  selectSaleReportByTimeRangeWithdrawList,
} from 'redux/features/saleReport/slice';
import { formatDate } from 'utils/date';
import { Tab } from '../types';

const Content: React.FC = () => {
  const [urlParams] = useUpdateUrlParams();
  const { tab: tabParam = Tab.VND } = urlParams;

  const currencyType = +tabParam === Tab.VND ? CURRENCY_TYPE.VND : CURRENCY_TYPE.USDT;

  const topUpsList = useAppSelector(selectSaleReportByTimeRangeTopUpList);
  const withdrawsList = useAppSelector(selectSaleReportByTimeRangeWithdrawList);
  const totalList = useAppSelector(selectSaleReportByTimeRangeTotalList);

  const dateCategories = useMemo(() => {
    const list: unknown = [...Object.values(withdrawsList), ...Object.values(topUpsList)];
    return _uniq(
      (list as SaleReportItem.AsObject[])
        .sort((a, b) => a.date.seconds - b.date.seconds)
        .map((item) => formatDate(item.date.seconds * 1000)),
    );
  }, [topUpsList, withdrawsList]);

  const columns = useMemo(
    () => (payment: PaymentType.TOPUP | PaymentType.WITHDRAW) =>
      [
        {
          Header: t('Date'),
          accessor: (row: SaleReportItem.AsObject) => formatDate(row.date.seconds * 1000),
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
              categories={dateCategories}
              series={[
                {
                  name: t('Top-Up'),
                  data: dateCategories.map((date) => +topUpsList[date]?.amount || 0),
                },
                {
                  name: t('Withdraw'),
                  data: dateCategories.map((date) => +withdrawsList[date]?.amount || 0),
                },
              ]}
            />
          </LayoutPaper>
        </Grid>
        <Grid item xs={12}>
          <LayoutPaper header={t('Top-Up Data')}>
            <AlopayTable
              columns={columnsTopup}
              data={(Object.values(topUpsList) as any).sort(
                (a, b) => a.date.seconds - b.date.seconds,
              )}
            />
          </LayoutPaper>
        </Grid>
        <Grid item xs={12}>
          <LayoutPaper header={t('Withdraw Data')}>
            <AlopayTable
              columns={columnsWithdraw}
              data={(Object.values(withdrawsList) as any).sort(
                (a, b) => a.date.seconds - b.date.seconds,
              )}
            />
          </LayoutPaper>
        </Grid>
      </Grid>
    </>
  );
};

export default Content;
