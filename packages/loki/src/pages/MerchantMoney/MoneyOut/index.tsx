import { PaymentType } from '@mcuc/natasha/natasha_pb';
import { t } from 'i18next';
import { useEffect, useMemo } from 'react';
import { formatCurrency } from 'utils/common';

import Toolbar from 'components/ToolBar';
import AlopayTable from 'components/AlopayTable';

import { CURRENCY_TYPE } from 'utils/constant/payment';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { useParams } from 'react-router-dom';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { startOfMonth } from 'date-fns/esm';
import { selectMerchantMoneyOut, selectMerchantMoneyStatus } from 'redux/features/merchantMoney/slice';
import { getListPaymentsOfMerchantThunk } from 'redux/features/merchantMoney/thunks';
import { formatTimeStampToSeconds } from 'utils/date';
import { StatusEnum } from 'redux/constant';

type MoneyOutProps = {};

interface ISummaryData {
  totalMerchantWithdraw: number;
  totalUserWithdraw: number;
  total: number;
}

const MoneyOut: React.FunctionComponent<MoneyOutProps> = () => {
  const { id: merchantId } = useParams<{ id: string }>();
  const [currentParams] = useUpdateUrlParams();
  const { startDate } = currentParams;

  const startDateParam =
    +startDate || +new Date(Date.UTC(startOfMonth(new Date()).getFullYear(), startOfMonth(new Date()).getMonth(), 1));

  const dispatch = useAppDispatch();
  const merchantMoneyOut = useAppSelector(selectMerchantMoneyOut);
  const merchantMoneyOutArr = Object.values(merchantMoneyOut);
  const merchantMoneyStatus = useAppSelector(selectMerchantMoneyStatus);

  useEffect(() => {
    dispatch(
      getListPaymentsOfMerchantThunk({
        merchantId: +merchantId,
        id: 0,
        typesList: [
          PaymentType.USER_WITHDRAW,
          PaymentType.MERCHANT_WITHDRAW_FUNDS,
          PaymentType.MERCHANT_WITHDRAW_PROFIT,
        ],
        page: 1,
        size: 50,
        fromDate: {
          seconds: formatTimeStampToSeconds(startDateParam),
          nanos: 0,
        },
      }),
    );
  }, [dispatch, merchantId, startDateParam]);

  const summaryData = useMemo(() => {
    const data = merchantMoneyOutArr.reduce(
      (all, item) => {
        all['totalMerchantWithdraw'] += item['Merchant'] || 0;
        all['totalUserWithdraw'] += item['User'] || 0;
        return all;
      },
      {
        totalMerchantWithdraw: 0,
        totalUserWithdraw: 0,
      },
    );
    return {
      ...(data as ISummaryData),
      total: data['totalMerchantWithdraw'] + data['totalUserWithdraw'],
    };
  }, [merchantMoneyOutArr]);

  const columns = [
    {
      Header: t('Date'),
      accessor: 'date',
      Footer: () => t('Total'),
    },
    {
      Header: `${t('Merchant withdraw')} (${CURRENCY_TYPE.VND})`,
      accessor: (row: any) => formatCurrency(row['Merchant'] || 0),
      Footer: () => formatCurrency(summaryData.totalMerchantWithdraw),
    },
    {
      Header: `${t('User withdraw')} (${CURRENCY_TYPE.VND})`,
      accessor: (row: any) => formatCurrency(row['User'] || 0),
      Footer: () => formatCurrency(summaryData.totalUserWithdraw),
    },
    {
      Header: `${t('Total')} (${CURRENCY_TYPE.VND})`,
      accessor: (row: any) => formatCurrency((row['Merchant'] || 0) + (row['User'] || 0)),
      Footer: () => formatCurrency(summaryData.total),
    },
  ];

  return (
    <>
      <Toolbar />
      <AlopayTable loading={merchantMoneyStatus === StatusEnum.LOADING} columns={columns} data={merchantMoneyOutArr} />
    </>
  );
};

export default MoneyOut;
