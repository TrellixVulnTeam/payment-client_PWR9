import { MethodType, PaymentType, PaymentWithDetail, Status } from '@mcuc/stark/stark_pb';
import { Tooltip } from '@material-ui/core';
import { t } from 'i18next';
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Order } from '@mcuc/stark/vision_pb';

import { StatusEnum } from 'redux/constant';
import { useAppSelector } from 'redux/store';
import { listPaymentsThunk } from 'redux/features/payments/thunks';
import { selectMerchantEntities, selectMerchant } from 'redux/features/merchants/slice';
import { selectDisplayPayments, selectPaymentsState } from 'redux/features/payments/slice';

import AllowedTo from 'components/AllowedTo';
import FilterBar from 'components/FilterBar';
import DateRange from 'components/DateRange';
import Grid from 'components/StyleGuide/Grid';
import Icon from 'components/StyleGuide/Icon';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import GroupDropdown from 'components/StyleGuide/GroupDropdown';
import AlopayTable from 'components/AlopayTable';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { Input } from 'components/StyleGuide/Input';
import { DateFormat, ID } from 'components/Table/lib';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';

import {
  getMethodType,
  getPaymentProviderFromMethodType,
  getCurrencyType,
  getPaymentDetailPayerAccount,
  getPaymentDetailAmount,
  getPaymentDetailPayerName,
} from 'utils/constant/payment';
import useCheckbox from 'hooks/useCheckbox';
import useCheckboxGroup from 'hooks/useCheckboxGroup';
import useSearchKeyword from 'hooks/useSearchKeyword';
import useTablePagination from 'hooks/useTablePagination';
import { formatCurrency } from 'utils/common';
import { formatTimeStampToSeconds } from 'utils/date';
import { truncateAddressCrypto } from 'utils/constant/crypto';
import { PerformPermission } from 'configs/routes/permission';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { Search } from 'assets/icons/ILT';

import DialogCreateTopUp from '../CreateTopUp';
import { DEFAULT_PAGE, DEFAULT_PAGESIZE, STATUS_FAILED } from '../constants';
import { providerOptions } from '../config';
import styles from './styles.module.scss';

type ContentTopupProps = {
  status: number;
};

const ContentTopup: React.FunctionComponent<ContentTopupProps> = ({ status }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  // get query params
  const statusId = status || Status.CREATED;

  const [currentParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const { page, pageSize, onChangePage, onChangePageSize } = useTablePagination({
    defaultPage: DEFAULT_PAGE,
    defaultPageSize: DEFAULT_PAGESIZE,
  });

  const { keyword, onChangeKeyword, onKeyDownKeyword, onSubmitKeyword, onClearKeyword } = useSearchKeyword();

  const {
    bank_ids: bankIdsParam,
    telco_ids: telcoIdsParam,
    merchant_ids: merchantIdsParam,
    ewallet_ids: eWalletParam,
    crypto_type_ids: cryptoTypeIdsParam,
    keyword: keywordParam,
    startDate: startDateParam,
    endDate: endDateParam,
  } = currentParams;

  const merchants = useAppSelector(selectMerchant);
  const merchantsById = useAppSelector(selectMerchantEntities);
  const paymentsState = useAppSelector(selectPaymentsState);
  const payments = useAppSelector(selectDisplayPayments);

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
      if (eWalletParam) {
        eWalletParam.split(',').forEach((id) => {
          providers.push({
            value: id,
            groupValue: 'ewallet',
            groupIndex: 2,
          });
        });
      }
      if (cryptoTypeIdsParam) {
        cryptoTypeIdsParam.split(',').forEach((id) => {
          providers.push({
            value: id,
            groupValue: 'crypto',
            groupIndex: 3,
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
    return providers;
  }, [bankIdsParam, telcoIdsParam, eWalletParam, cryptoTypeIdsParam]);
  const defaultMerchantIds = merchantIdsParam ? merchantIdsParam.split(',') : [];
  const merchantOptions = useMemo(
    () =>
      merchants.map((item) => ({
        name: item.name,
        value: item.id.toString(),
      })),
    [merchants],
  );

  const handleSelectMerchants = (merchantIds = []) => {
    setUrlParams({ merchant_ids: merchantIds.join(',') });
  };

  const handleSelectProvider = (providers = []) => {
    const listProviders = {
      bank: [],
      telco: [],
      ewallet: [],
      crypto: [],
    };
    providers.forEach((pro) => {
      listProviders[pro.groupValue].push(pro.value);
    });
    setUrlParams({
      bank_ids: listProviders.bank.join(','),
      telco_ids: listProviders.telco.join(','),
      ewallet_ids: listProviders.ewallet.join(','),
      crypto_type_ids: listProviders.crypto.join(','),
    });
  };

  const {
    selected: selectedMerchant,
    onChange: onChangeMerchant,
    unselectAll: unselectAllMerchant,
  } = useCheckbox(
    defaultMerchantIds,
    merchantOptions.map((item) => item.value.toString()),
    handleSelectMerchants,
  );
  const {
    selected: selectedProvider,
    onChange: onChangeProvider,
    onClear: onClearProvider,
  } = useCheckboxGroup(defaultProviders, providerOptions, handleSelectProvider);

  const loadData = React.useCallback(() => {
    dispatch(
      listPaymentsThunk({
        order: +statusId === Status.CREATED ? Order.CREATED_AT_ASC : Order.UPDATED_AT_DESC,
        paymentTypesList: [PaymentType.TOPUP],
        bankNamesList: selectedProvider.filter((item) => item.groupValue === 'bank').map((item) => +item.value),
        cryptoWalletNameList: selectedProvider
          .filter((item) => item.groupValue === 'crypto')
          .map((item) => +item.value),
        eWalletNamesList: selectedProvider.filter((item) => item.groupValue === 'ewallet').map((item) => +item.value),
        telcoNamesList: selectedProvider.filter((item) => item.groupValue === 'telco').map((item) => +item.value),
        merchantIdsList: selectedMerchant.map((item) => +item),
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
    selectedMerchant,
    selectedProvider,
    keywordParam,
    statusId,
    startDateParam,
    endDateParam,
    page,
    pageSize,
  ]);

  useEffect(() => {
    loadData();
  }, [
    loadData,
    selectedMerchant,
    selectedProvider,
    keywordParam,
    statusId,
    startDateParam,
    endDateParam,
    page,
    pageSize,
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
        Header: t('Payer name'),
        accessor: (row: PaymentWithDetail.AsObject) => getPaymentDetailPayerName(row) || '-',
      },
      {
        Header: t('Payer account'),
        accessor: (row: PaymentWithDetail.AsObject) => {
          const method = row.payment.method;
          const account = getPaymentDetailPayerAccount(row);
          return method === MethodType.C ? (
            <Tooltip
              hidden={method !== MethodType.C}
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
          const method = row.payment.method;
          const amount = getPaymentDetailAmount(row);
          return `${formatCurrency(amount)} ${getCurrencyType(method)}`;
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
    onClearKeyword();
    unselectAllMerchant();
    onClearProvider();
    //
    clearUrlParams({
      ignoreParams: ['status'],
    });
  };

  const showReset =
    selectedProvider.length || selectedMerchant.length || keywordParam || startDateParam || endDateParam;
  const isShowFilter = merchants.length > 0;

  return (
    <Grid container direction="column" spacing={6}>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={true}>
            {isShowFilter && (
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
                        placeholder={`${t('Method')} & ${t('Provider')}`}
                        options={providerOptions}
                        selected={selectedProvider}
                        onClear={onClearProvider}
                        onChange={onChangeProvider}
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
                        selected={selectedMerchant}
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
            )}
          </Grid>
          <AllowedTo
            logic="or"
            perform={[
              PerformPermission.paymentTopUp.createBankingTopUp,
              PerformPermission.paymentTopUp.createEWalletTopUp,
            ]}
            watch={[loadData]}
          >
            <Grid item xs="auto">
              <Grid container spacing={3}>
                <Grid item>
                  <DialogCreateTopUp refreshListPayments={loadData} />
                </Grid>
              </Grid>
            </Grid>
          </AllowedTo>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <AlopayTable
          columns={columns}
          data={payments}
          loading={paymentsState.status === StatusEnum.LOADING}
          pagination={{
            totalRecord: paymentsState.pagination.totalRecord,
            current: page,
            pageSize: pageSize,
            onChangePage: onChangePage,
            onChangePageSize: onChangePageSize,
          }}
          tableRowProps={{
            onClick: (row) => {
              history.push(`/payment/top-up-detail/${row.id}`, { from: location.pathname + location.search });
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default React.memo(ContentTopup);
