import { PaymentType } from '@mcuc/natasha/natasha_pb';
import Toolbar from 'components/ToolBar';
import AlopayTable from 'components/AlopayTable';
import { useEffect, useMemo } from 'react';
import { formatCurrency } from 'utils/common';
import { t } from 'i18next';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { useParams } from 'react-router-dom';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { startOfMonth } from 'date-fns/esm';
import { selectMerchantMoneyIn, selectMerchantMoneyStatus } from 'redux/features/merchantMoney/slice';
import { getListPaymentsOfMerchantThunk } from 'redux/features/merchantMoney/thunks';
import { formatTimeStampToSeconds } from 'utils/date';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import { StatusEnum } from 'redux/constant';

type MoneyInProps = {};

interface ISummaryData {
  totalDeposit: number;
  totalTopup: number;
  total: number;
}

const MoneyIn: React.FC<MoneyInProps> = () => {
  const { id: merchantId } = useParams<{ id: string }>();
  const [currentParams] = useUpdateUrlParams();
  const { startDate } = currentParams;

  const startDateParam =
    +startDate || +new Date(Date.UTC(startOfMonth(new Date()).getFullYear(), startOfMonth(new Date()).getMonth(), 1));

  const dispatch = useAppDispatch();
  const merchantMoneyIn = useAppSelector(selectMerchantMoneyIn);
  const merchantMoneyInArr = Object.values(merchantMoneyIn);
  const merchantMoneyStatus = useAppSelector(selectMerchantMoneyStatus);

  useEffect(() => {
    dispatch(
      getListPaymentsOfMerchantThunk({
        merchantId: +merchantId,
        id: 0,
        typesList: [
          PaymentType.MERCHANT_DEPOSIT_ADDITIONAL,
          PaymentType.MERCHANT_DEPOSIT_COMPENSATION,
          PaymentType.USER_TOP_UP,
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
    const data = merchantMoneyInArr.reduce(
      (all, item) => {
        all['totalDeposit'] += item['Merchant'] || 0;
        all['totalTopup'] += item['User'] || 0;
        return all;
      },
      {
        totalDeposit: 0,
        totalTopup: 0,
      },
    );
    return {
      ...(data as ISummaryData),
      total: data['totalDeposit'] + data['totalTopup'],
    };
  }, [merchantMoneyInArr]);

  const columns = [
    {
      Header: t('Date'),
      accessor: 'date',
      Footer: () => t('Total'),
    },
    {
      Header: `${t('Merchant deposit')} (${CURRENCY_TYPE.VND})`,
      accessor: (row: any) => formatCurrency(row['Merchant'] || 0),
      Footer: () => formatCurrency(summaryData.totalDeposit),
    },
    {
      Header: `${t('User top-up')} (${CURRENCY_TYPE.VND})`,
      accessor: (row: any) => formatCurrency(row['User'] || 0),
      Footer: () => formatCurrency(summaryData.totalTopup),
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
      <AlopayTable loading={merchantMoneyStatus === StatusEnum.LOADING} columns={columns} data={merchantMoneyInArr} />
    </>
  );
};

export default MoneyIn;
