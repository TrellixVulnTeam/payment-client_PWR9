import { MethodType, PaymentType, PaymentWithDetail, Status } from '@mcuc/stark/stark_pb';
import { t } from 'i18next';
import { Tooltip } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Order } from '@mcuc/stark/vision_pb';

import { useAppSelector } from 'redux/store';
import { StatusEnum } from 'redux/constant';
import { selectMerchantEntities, selectMerchant } from 'redux/features/merchants/slice';
import { selectDisplayPayments } from 'redux/features/payments/slice';
import { listPaymentsThunk } from 'redux/features/payments/thunks';

import Icon from 'components/StyleGuide/Icon';
import Grid from 'components/StyleGuide/Grid';
import FilterBar from 'components/FilterBar';
import DateRange from 'components/DateRange';
import AlopayTable from 'components/AlopayTable';
import GroupDropdown from 'components/StyleGuide/GroupDropdown';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { Input } from 'components/StyleGuide/Input';
import { DateFormat, ID } from 'components/Table/lib';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';

import useCheckbox from 'hooks/useCheckbox';
import useCheckboxGroup from 'hooks/useCheckboxGroup';

import {
  getCurrencyType,
  getMethodType,
  getPaymentDetailAmount,
  getPaymentDetailPayeeAccount,
  getPaymentDetailPayeeName,
  getPaymentProviderFromMethodType,
} from 'utils/constant/payment';
import { formatCurrency, formatOptions } from 'utils/common';
import { formatTimeStampToSeconds } from 'utils/date';
import { truncateAddressCrypto } from 'utils/constant/crypto';
import { Search } from 'assets/icons/ILT';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';

import useSearchKeyword from 'hooks/useSearchKeyword';
import useTablePagination from 'hooks/useTablePagination';

import { providerOptions } from '../config';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, STATUS_FAILED } from '../constants';
import styles from './styles.module.scss';

type ContentWithdrawProps = {
  status: number;
};

const ContentWithdraw: React.FunctionComponent<ContentWithdrawProps> = ({ status }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [currentParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const { page, pageSize, onChangePage, onChangePageSize } = useTablePagination({
    defaultPage: DEFAULT_PAGE,
    defaultPageSize: DEFAULT_PAGE_SIZE,
  });

  const { keyword, onChangeKeyword, onKeyDownKeyword, onSubmitKeyword, onClearKeyword } = useSearchKeyword();

  const {
    bank_ids: bankIdsParam,
    telco_ids: telcoIdsParam,
    merchant_ids: merchantIdsParam,
    crypto_type_ids: cryptoTypeIdsParam,
    keyword: keywordParam,
    startDate: startDateParam,
    endDate: endDateParam,
  } = currentParams;

  // merchant tab state
  const statusId = status || Status.CREATED;

  const merchants = useAppSelector(selectMerchant);
  const merchantsById = useAppSelector(selectMerchantEntities);
  const statusList = useAppSelector((state) => state.payments.status);

  const paymentsState = useAppSelector((state) => state.payments);
  const payments = useAppSelector(selectDisplayPayments);

  let defaultMerchants = [];
  try {
    if (merchantIdsParam) {
      defaultMerchants = merchantIdsParam.split(',');
    }
  } catch (e) {
    console.log(e);
  }

  const defaultProviders = useMemo(() => {
    const providers = [];
    try {
      if (bankIdsParam) {
        bankIdsParam.split(',').forEach((id) => {
          providers.push({
            value: id,
            groupValue: 'bank',
            groupIndex: 0,
          });
        });
      }
      if (telcoIdsParam) {
        telcoIdsParam.split(',').forEach((id) => {
          providers.push({
            value: id,
            groupValue: 'telco',
            groupIndex: 1,
          });
        });
      }
      if (cryptoTypeIdsParam) {
        cryptoTypeIdsParam.split(',').forEach((id) => {
          providers.push({
            value: id,
            groupValue: 'crypto',
            groupIndex: 2,
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
    return providers;
  }, [bankIdsParam, telcoIdsParam, cryptoTypeIdsParam]);

  const handleSelectMerchants = (merchantIds = []) => {
    setUrlParams({ merchant_ids: (merchantIds || []).join(',') });
  };

  const merchantOptions = formatOptions(merchants, { name: 'name', value: 'id', valueType: 'string' });
  const {
    selected: selectedMerchants,
    onChange: onChangeMerchant,
    unselectAll: unselectAllMerchant,
  } = useCheckbox(
    defaultMerchants,
    merchantOptions.map((item) => item.value),
    handleSelectMerchants,
  );

  const handleSelectProvider = (providers = []) => {
    const listProviders = {
      bank: [],
      telco: [],
      crypto: [],
    };
    providers.forEach((pro) => {
      listProviders[pro.groupValue].push(pro.value);
    });
    setUrlParams({
      bank_ids: listProviders.bank.join(','),
      telco_ids: listProviders.telco.join(','),
      crypto_type_ids: listProviders.crypto.join(','),
    });
  };

  const {
    selected: selectedProvider,
    onChange: onChangeProvider,
    onClear: onClearProvider,
  } = useCheckboxGroup(defaultProviders, providerOptions, handleSelectProvider);

  const loadData = React.useCallback(() => {
    dispatch(
      listPaymentsThunk({
        order: +statusId === Status.CREATED ? Order.CREATED_AT_ASC : Order.UPDATED_AT_DESC,
        paymentTypesList: [PaymentType.WITHDRAW],
        eWalletNamesList: [],
        bankNamesList: selectedProvider.filter((item) => item.groupValue === 'bank').map((item) => +item.value),
        cryptoWalletNameList: selectedProvider
          .filter((item) => item.groupValue === 'crypto')
          .map((item) => +item.value),
        telcoNamesList: selectedProvider.filter((item) => item.groupValue === 'telco').map((item) => +item.value),
        merchantIdsList: selectedMerchants.map((item) => +item),
        methodsList: [],
        page: page,
        size: pageSize,
        paymentIdsList: !!keywordParam ? [+keywordParam] : [],
        statusesList:
          +statusId === +STATUS_FAILED
            ? [Status.REJECT_FAILED, Status.APPROVE_FAILED, Status.SUBMIT_FAILED]
            : [+statusId],
        from: startDateParam
          ? {
              seconds: formatTimeStampToSeconds(startDateParam),
              nanos: 0,
            }
          : undefined,
        to: endDateParam
          ? {
              seconds: formatTimeStampToSeconds(endDateParam),
              nanos: 0,
            }
          : undefined,
      }),
    );
  }, [
    dispatch,
    page,
    pageSize,
    statusId,
    selectedMerchants,
    keywordParam,
    selectedProvider,
    startDateParam,
    endDateParam,
  ]);

  useEffect(() => {
    loadData();
  }, [
    loadData,
    page,
    pageSize,
    statusId,
    selectedMerchants,
    keywordParam,
    selectedProvider,
    startDateParam,
    endDateParam,
  ]);

  const columns = useMemo(
    () => [
      {
        Header: t('Payment ID'),
        accessor: (row: PaymentWithDetail.AsObject) => <ID value={row.payment.id.toString()} />,
      },
      {
        Header: t('Method'),
        accessor: (row: PaymentWithDetail.AsObject) => getMethodType(row.payment?.method)?.name || '-',
      },
      {
        Header: t('Provider'),
        accessor: (row: PaymentWithDetail.AsObject) => getPaymentProviderFromMethodType(row)?.name || '-',
      },
      {
        Header: t('Merchant'),
        accessor: (row: PaymentWithDetail.AsObject) => merchantsById[row.payment?.merchantId]?.name || '-',
      },
      {
        Header: t('Payee name'),
        accessor: (row: PaymentWithDetail.AsObject) => getPaymentDetailPayeeName(row) || '-',
      },
      {
        Header: t('Payee account'),
        accessor: (row: PaymentWithDetail.AsObject) => {
          const method = row.payment.method;
          const account = getPaymentDetailPayeeAccount(row);
          return method === MethodType.C ? (
            <Tooltip
              title={
                <Typography variant={TypoVariants.body2} type={TypoTypes.invert}>
                  {account}
                </Typography>
              }
              placement="top"
              enterDelay={200}
              leaveDelay={200}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <span>{truncateAddressCrypto(account)}</span>
            </Tooltip>
          ) : (
            <span>{account || '-'}</span>
          );
        },
      },
      {
        Header: `${t('Amount')}`,
        accessor: (row: PaymentWithDetail.AsObject) => {
          return `${formatCurrency(getPaymentDetailAmount(row))} ${getCurrencyType(row.payment.method)}`;
        },
      },
      {
        Header: t('Created time'),
        accessor: (row: PaymentWithDetail.AsObject) => <DateFormat date={row.payment?.createdAt} />,
      },
      {
        Header: t('Updated time'),
        accessor: (row: PaymentWithDetail.AsObject) => <DateFormat date={row.payment?.updatedAt} />,
      },
    ],
    [merchantsById],
  );

  const handleClearFilter = () => {
    unselectAllMerchant();
    onClearProvider();
    onClearKeyword();
    // call last
    clearUrlParams();
  };

  const showReset =
    selectedProvider.length || selectedMerchants.length || keywordParam || startDateParam || endDateParam;

  return (
    <Grid container direction="column" spacing={6}>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <FilterBar
            showReset={!!showReset}
            onClear={handleClearFilter}
            className="custom-item"
            list={[
              {
                width: {},
                component: (
                  <Input
                    value={keyword}
                    placeholder={t('Search')}
                    afterInput={
                      <InputAdornment onClick={onSubmitKeyword}>
                        <Icon className={styles['search-icon']} component={Search} />
                      </InputAdornment>
                    }
                    onChange={onChangeKeyword}
                    onKeyDown={onKeyDownKeyword}
                    className="custom-search"
                  />
                ),
              },
              {
                width: {},
                component: (
                  <GroupDropdown
                    variant={SelectVariants.selected}
                    placeholder={`${t('Merchant')} & ${t('Provider')}`}
                    options={providerOptions}
                    onChange={onChangeProvider}
                    selected={selectedProvider}
                    onClear={onClearProvider}
                    className="custom-fit-content"
                  />
                ),
              },
              {
                width: {},
                component: (
                  <MultipleSelect
                    variant={SelectVariants.selected}
                    placeholder={t('Merchant')}
                    selected={selectedMerchants}
                    onChange={onChangeMerchant}
                    onClear={unselectAllMerchant}
                    options={merchantOptions}
                    className="custom-fit-content"
                  />
                ),
              },
              {
                width: { xs: 'auto' },
                component: <DateRange />,
              },
            ]}
          />
        </Grid>
      </Grid>
      <Grid item style={{ width: '100%' }}>
        <AlopayTable
          columns={columns}
          data={payments}
          loading={statusList === StatusEnum.LOADING}
          pagination={{
            totalRecord: paymentsState.pagination.totalRecord,
            current: page,
            pageSize: pageSize,
            onChangePage: onChangePage,
            onChangePageSize: onChangePageSize,
          }}
          tableRowProps={{
            onClick: (row) => {
              history.push(`/payment/withdraw-detail/${row.id}`, { from: location.pathname + location.search });
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default React.memo(ContentWithdraw);
