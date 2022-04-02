import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { t } from 'i18next';
import { SystemCryptoHotWallet } from '@mcuc/stark/ultron_pb';

import { useAppSelector } from 'redux/store';
import { StatusEnum } from 'redux/constant';

import AllowedTo from 'components/AllowedTo';
import FilterBar from 'components/FilterBar';
import Icon from 'components/StyleGuide/Icon';
import Grid from 'components/StyleGuide/Grid';
import AlopayTable from 'components/AlopayTable';
import StatusCryptoWallet from 'components/Status/CryptoWallet';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import { ID } from 'components/Table/lib';
import { Input } from 'components/StyleGuide/Input';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';

import useSearchKeyword from 'hooks/useSearchKeyword';
import useTablePagination from 'hooks/useTablePagination';
import useCheckbox from 'hooks/useCheckbox';
import { formatCurrency, formatOptions } from 'utils/common';
import { getCryptoType, getNetworkType, NETWORKS, STATUSES } from 'utils/constant/crypto';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { Search } from 'assets/icons/ILT';

import DialogImportWallet from '../DialogImportWallet';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { PerformPermission } from 'configs/routes/permission';
import { listCryptoHotWalletsThunk } from 'redux/features/walletHotWallet/thunks';
import {
  selectCryptoHotWalletAll,
  selectCryptoHotWalletStatusListing,
  selectCryptoHotWalletTotalRecord,
} from 'redux/features/walletHotWallet/slice';
import { ALL_MERCHANT, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';
import { CURRENCY_TYPE } from 'utils/constant/payment';

interface Props {
  merchantId: number;
}

const WalletUMOContent = (props: Props) => {
  const { merchantId } = { ...props };
  const dispatch = useDispatch();

  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '',
        label: t('Wallet'),
      },
      {
        to: '',
        label: t('Hot Wallet'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  const { page, pageSize, onChangePage, onChangePageSize } = useTablePagination({
    defaultPage: DEFAULT_PAGE,
    defaultPageSize: DEFAULT_PAGE_SIZE,
  });

  const { keyword, onChangeKeyword, onKeyDownKeyword, onSubmitKeyword, onClearKeyword } = useSearchKeyword();

  const cryptoHotWallet = useAppSelector(selectCryptoHotWalletAll);
  const totalRecord = useAppSelector(selectCryptoHotWalletTotalRecord);
  const statusListing = useAppSelector(selectCryptoHotWalletStatusListing);

  const { status_ids: statusIdsParam, network_ids: networkIdsParam } = urlParams;

  const defaultStatusIds = statusIdsParam ? statusIdsParam.split(',') : [];
  const defaultNetworkIds = networkIdsParam ? networkIdsParam.split(',') : [];

  const {
    selected: selectedStatus,
    onChange: onChangeStatus,
    unselectAll: unselectAllStatus,
  } = useCheckbox(
    defaultStatusIds,
    STATUSES.map((item) => item.value.toString()),
    (statusIds = []) => setUrlParams({ status_ids: statusIds.join(','), page: DEFAULT_PAGE }),
  );

  const {
    selected: selectedNetwork,
    onChange: onChangeNetwork,
    unselectAll: unselectAllNetwork,
  } = useCheckbox(
    defaultNetworkIds,
    NETWORKS.map((item) => item.value.toString()),
    (networkIds = []) => setUrlParams({ network_ids: networkIds.join(','), page: DEFAULT_PAGE }),
  );

  const statusOptions = formatOptions(STATUSES, { name: 'name', value: 'value', valueType: 'string' });
  const networkOptions = formatOptions(NETWORKS, { name: 'name', value: 'value', valueType: 'string' });

  const loadData = useCallback(() => {
    dispatch(
      listCryptoHotWalletsThunk({
        page: page,
        size: pageSize,
        addressesList: !!keyword ? [keyword] : [],
        cryptoNetworkTypesList: selectedNetwork as any[],
        statusesList: selectedStatus.map(Number) as any[],
        cryptoTypesList: [],
        merchantIdsList: merchantId !== -1 ? [merchantId] : [],
      }),
    );
  }, [dispatch, keyword, merchantId, selectedNetwork, selectedStatus, page, pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData, dispatch, keyword, merchantId, selectedNetwork, selectedStatus, page, pageSize]);

  const columns = useMemo(
    () => [
      {
        Header: t('Wallet ID'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => <ID value={row.id.toString()} />,
      },
      {
        Header: t('Wallet address'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => <ID value={row.address} />,
      },
      {
        Header: t('Coin'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => getCryptoType(row.cryptoType)?.name || '-',
      },
      {
        Header: t('Network'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => getNetworkType(row.cryptoNetworkType)?.name || '-',
      },

      {
        Header: `${t('Balance')} (${CURRENCY_TYPE.USDT})`,
        accessor: (row: SystemCryptoHotWallet.AsObject) => formatCurrency(row.balance) || '-',
      },
      {
        Header: `${t('Total Balance')} (${CURRENCY_TYPE.USDT})`,
        accessor: (row: SystemCryptoHotWallet.AsObject) => formatCurrency(row.totalBalance) || '-',
      },
      {
        Header: t('Status'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => <StatusCryptoWallet value={row.status} />,
      },
    ],
    [],
  );

  const handleClearFilter = () => {
    unselectAllStatus();
    unselectAllNetwork();
    onClearKeyword();
    clearUrlParams({
      ignoreParams: ['merchant'],
    });
  };

  const showReset = !!keyword || selectedNetwork.length || selectedStatus.length;

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={true}>
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
                      placeholder={t('Search by {{key}}', { key: t('Wallet address').toLowerCase() })}
                      afterInput={
                        <InputAdornment onClick={onSubmitKeyword}>
                          <Icon component={Search} />
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
                    <MultipleSelect
                      variant={SelectVariants.selected}
                      placeholder={t('Status')}
                      selected={selectedStatus}
                      onChange={onChangeStatus}
                      onClear={unselectAllStatus}
                      options={statusOptions}
                      className="custom-fit-content"
                    />
                  ),
                },
                {
                  width: {},
                  component: (
                    <>
                      <MultipleSelect
                        variant={SelectVariants.selected}
                        placeholder={t('Network')}
                        selected={selectedNetwork}
                        onChange={onChangeNetwork}
                        onClear={unselectAllNetwork}
                        options={networkOptions}
                        className="custom-fit-content"
                      />
                    </>
                  ),
                },
              ]}
            />
          </Grid>
          <Grid item xs="auto">
            {merchantId !== ALL_MERCHANT && (
              <Grid container spacing={3}>
                <AllowedTo perform={PerformPermission.walletUMO.importCryptoWallets} watch={[loadData]}>
                  <Grid item xs="auto">
                    <DialogImportWallet callback={loadData} />
                  </Grid>
                </AllowedTo>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <AlopayTable
          columns={columns}
          data={cryptoHotWallet}
          pagination={{
            totalRecord,
            current: page,
            pageSize: pageSize,
            onChangePage: onChangePage,
            onChangePageSize: onChangePageSize,
          }}
          loading={statusListing === StatusEnum.LOADING}
        />
      </Grid>
    </Grid>
  );
};

export default React.memo(WalletUMOContent);
