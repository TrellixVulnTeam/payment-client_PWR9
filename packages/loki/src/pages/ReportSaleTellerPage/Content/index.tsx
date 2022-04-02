import React, { useMemo } from 'react';
import { t } from 'i18next';
import { Box, Grid } from '@material-ui/core';
import _uniqBy from 'lodash-es/uniqBy';

import AlopayTable from 'components/AlopayTable';
import BarChart from 'components/Charts/BarChart';
import LayoutPaper from 'components/Layout/LayoutPaper';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { formatCurrency } from 'utils/common';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';
import { Tab } from '../types';
import {
  selectSaleReportByTellerTopUpList,
  selectSaleReportByTellerTotalList,
  selectSaleReportByTellerWithdrawList,
} from 'redux/features/saleReport/slice';
import { useAppSelector } from 'redux/store';
import { PaymentType } from '@mcuc/stark/stark_pb';
import { SaleReportItem } from '@mcuc/stark/howard_pb';
import useUsersMap from 'hooks/useUsersMap';
import { StatusEnum } from 'redux/constant';
import PageLoader from 'components/PageLoader';

const Content: React.FC = () => {
  const [urlParams] = useUpdateUrlParams();
  const { tab: tabParam = Tab.VND } = urlParams;
  const currencyType = +tabParam === Tab.VND ? CURRENCY_TYPE.VND : CURRENCY_TYPE.USDT;
  const topupList = useAppSelector(selectSaleReportByTellerTopUpList);
  const withdrawList = useAppSelector(selectSaleReportByTellerWithdrawList);
  const totalList = useAppSelector(selectSaleReportByTellerTotalList);
  const tellerIds = useMemo(
    () => _uniqBy([...topupList, ...withdrawList], 'tellerId').map((item) => +item.tellerId),
    [topupList, withdrawList],
  );
  const { usersMap, status } = useUsersMap(tellerIds);

  const columns = useMemo(
    () => (payment: PaymentType.TOPUP | PaymentType.WITHDRAW) =>
      [
        {
          Header: t('Teller name'),
          accessor: (row: SaleReportItem.AsObject) => usersMap[row.tellerId]?.displayName || '-',
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
    [currencyType, usersMap, totalList],
  );

  const columnsTopup = columns(PaymentType.TOPUP);
  const columnsWithdraw = columns(PaymentType.WITHDRAW);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <LayoutPaper header={uppercaseFirstLetterAllWords(t('Total sale'))}>
            {status === StatusEnum.SUCCEEDED ? (
              <BarChart
                currencyType={currencyType}
                categories={topupList.map((item) => usersMap[item.tellerId]?.displayName || '-')}
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
            ) : (
              <Box display="flex" justifyContent="center">
                <PageLoader />
              </Box>
            )}
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
