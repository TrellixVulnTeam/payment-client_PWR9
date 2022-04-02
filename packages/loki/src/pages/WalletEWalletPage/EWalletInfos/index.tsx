import { EWalletStatus, SystemEWallet } from '@mcuc/stark/tony_pb';
import { t } from 'i18next';
import i18n from 'i18n';
import { Box } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  isFetchingList,
  selectEWalletInfos,
  selectTotalRecord,
  setSelectedEWalletInfo,
} from 'redux/features/walletEWallets/slice';
import { listSystemEWalletsThunk } from 'redux/features/walletEWallets/thunks';

import AllowedTo from 'components/AllowedTo';
import FilterBar from 'components/FilterBar';
import Icon from 'components/StyleGuide/Icon';
import Grid from 'components/StyleGuide/Grid';
import AlopayTable from 'components/AlopayTable';
import Option from 'components/StyleGuide/Option';
import Toggle from 'components/StyleGuide/Toggle';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { ID } from 'components/Table/lib';
import { DropdownList } from 'components/StyleGuide/DropdownList';
import { Input } from 'components/StyleGuide/Input';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import { isLegalPermission } from 'components/AllowedTo/utils';

import useAuth from 'hooks/useAuth';
import useCheckbox from 'hooks/useCheckbox';
import usePrevious from 'hooks/usePrevious';
import useSearchKeyword from 'hooks/useSearchKeyword';
import useTablePagination from 'hooks/useTablePagination';
import { formatCurrency } from 'utils/common';
import { Search } from 'assets/icons/ILT';
import { EWALLETS, CURRENCY_TYPE, getEWallet } from 'utils/constant/payment';
import { PerformPermission } from 'configs/routes/permission';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';

import ChangeStatusModal from './../ChangeStatusModal';
import ImportAccountModal from './../ImportAccountModal';
import CreateAccountModal from './../CreateAccountModal';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './../const';
import styles from './styles.module.scss';

interface Props {
  merchantId: number;
}

const STATUSES = [
  { name: i18n.t('All'), value: EWalletStatus.EWALLET_STATUS_UNSPECIFIED },
  { name: i18n.t('Active'), value: EWalletStatus.EWALLET_ACTIVE },
  { name: i18n.t('Inactive'), value: EWalletStatus.EWALLET_IN_ACTIVE },
];

const EWalletInfos = (props: Props) => {
  const { merchantId } = { ...props };
  const dispatch = useDispatch();
  const prevMerchantId = usePrevious(merchantId);

  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const { userPermissions } = useAuth();

  const { page, pageSize, onChangePage, onChangePageSize } = useTablePagination({
    defaultPage: DEFAULT_PAGE,
    defaultPageSize: DEFAULT_PAGE_SIZE,
  });

  const { keyword, onChangeKeyword, onKeyDownKeyword, onSubmitKeyword } = useSearchKeyword();

  const { status, ewallet_ids: eWalletIds, keyword: keywordParam } = urlParams;
  const statusId = +status || EWalletStatus.EWALLET_STATUS_UNSPECIFIED;

  const [showChangeStatusModal, toggleChangeStatusModal] = useState(false);

  const eWalletOptions = EWALLETS.map((item) => ({
    name: item.name,
    value: item.value.toString(),
  }));

  const eWalletDefaultIds = eWalletIds ? eWalletIds.split(',') : [];

  const {
    selected: selectedEWallet,
    onChange: onChangeEWallet,
    unselectAll: unselectAllEWallet,
  } = useCheckbox(
    eWalletDefaultIds,
    EWALLETS.map((item) => item.value.toString()),
    (data) => handleSelectEWallet(data),
  );

  const listing = useSelector(selectEWalletInfos);
  const totalRecord = useSelector(selectTotalRecord);
  const loading = useSelector(isFetchingList);

  useEffect(() => {
    if (showChangeStatusModal === false) {
      dispatch(setSelectedEWalletInfo(null));
    }
  }, [showChangeStatusModal, dispatch]);

  function handleCloseModal() {
    toggleChangeStatusModal(false);
  }

  const handleChangeStatus = (status) => {
    setUrlParams({ status, page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE });
  };

  const handleSelectEWallet = (eWalletIds = []) => {
    setUrlParams({ ewallet_ids: eWalletIds.join(','), page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE });
  };

  const loadData = React.useCallback(
    ({ eWalletIds = selectedEWallet, status = statusId } = {}) => {
      dispatch(
        listSystemEWalletsThunk({
          page: !!page ? +page : 1,
          size: !!pageSize ? +pageSize : DEFAULT_PAGE_SIZE,
          eWalletNamesList: eWalletIds,
          idsList: !!+keywordParam ? [+keywordParam] : [],
          statusesList: !!+status ? [+status] : [],
          merchantIdsList: !!merchantId ? [+merchantId] : [],
        }),
      );
    },
    [dispatch, keywordParam, merchantId, selectedEWallet, statusId, page, pageSize],
  );

  useEffect(() => {
    if (merchantId > 0) {
      loadData({ merchantId });
    }
  }, [loadData, merchantId, prevMerchantId, keywordParam, status, page, pageSize]);

  const handleToggleStatus = useCallback(
    (e: React.SyntheticEvent, data: SystemEWallet.AsObject) => {
      e.preventDefault();
      toggleChangeStatusModal(true);
      dispatch(
        setSelectedEWalletInfo({
          data,
        }),
      );
    },
    [dispatch],
  );

  const columns = useMemo(
    () => [
      {
        Header: t('Account ID'),
        accessor: (row: SystemEWallet.AsObject) => <ID value={row.id.toString()} />,
      },
      {
        Header: t('E-Wallet'),
        accessor: (row: SystemEWallet.AsObject) => getEWallet(row.eWalletName)?.name || '-',
      },
      {
        Header: t('Phone number'),
        accessor: (row: SystemEWallet.AsObject) => row.accountPhoneNumber || '-',
      },
      {
        Header: t('Account name'),
        accessor: (row: SystemEWallet.AsObject) => row.accountName || '-',
      },
      {
        Header: t('Balance'),
        accessor: (row: SystemEWallet.AsObject) => formatCurrency(row.balance) || '-',
      },
      {
        Header: `${t('Current daily balance')} (${CURRENCY_TYPE.VND})`,
        accessor: (row: SystemEWallet.AsObject) => formatCurrency(row.dailyBalance) || '-',
      },
      {
        Header: `${t('Daily balance limit')} (${CURRENCY_TYPE.VND})`,
        accessor: (row: SystemEWallet.AsObject) => formatCurrency(row.dailyBalanceLimit) || '-',
      },
      {
        Header: `${t('Daily used amount')} (${CURRENCY_TYPE.VND})`,
        accessor: (row: SystemEWallet.AsObject) => formatCurrency(row.dailyUsedAmount) || '-',
      },
      {
        Header: t('Status'),
        accessor: (row: SystemEWallet.AsObject) => {
          return (
            <Box display="flex" alignItems="center">
              <Toggle
                checked={row.status === EWalletStatus.EWALLET_ACTIVE}
                onClick={(e: React.SyntheticEvent) => handleToggleStatus(e, row)}
                style={{ marginRight: 10 }}
              />
              <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}>
                {row.status === EWalletStatus.EWALLET_ACTIVE ? t('Active') : t('Inactive')}
              </Typography>
            </Box>
          );
        },
        hidden: !isLegalPermission(PerformPermission.walletEWallet.updateSystemEWalletStatus, userPermissions),
      },
    ],
    [userPermissions, handleToggleStatus],
  );

  const handleClearFilter = () => {
    unselectAllEWallet();
    clearUrlParams({
      ignoreParams: ['merchant'],
    });
  };

  const showReset = statusId || selectedEWallet.length;

  return (
    <Grid container direction="column" spacing={3}>
      {/* filter */}
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
                      placeholder={t('Search by {{key}}', { key: 'ID' })}
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
                    <DropdownList
                      placeholder={t('Status')}
                      value={statusId}
                      onChange={handleChangeStatus}
                      className="custom-fit-content"
                    >
                      {STATUSES.map((item, idx) => (
                        <Option value={item.value} key={idx}>
                          {item.name}
                        </Option>
                      ))}
                    </DropdownList>
                  ),
                },
                {
                  width: {},
                  component: (
                    <MultipleSelect
                      variant={SelectVariants.selected}
                      placeholder={t('E-Wallet')}
                      selected={selectedEWallet}
                      onChange={onChangeEWallet}
                      onClear={unselectAllEWallet}
                      options={eWalletOptions}
                      className="custom-fit-content"
                    />
                  ),
                },
              ]}
            />
          </Grid>
          {/* create new  */}
          <Grid item xs="auto">
            <Grid container spacing={3}>
              <AllowedTo perform={PerformPermission.walletEWallet.importSystemEWallets} watch={[loadData]}>
                <Grid item xs="auto">
                  <ImportAccountModal callback={loadData} />
                </Grid>
              </AllowedTo>
              <AllowedTo perform={PerformPermission.walletEWallet.createSystemEWallet} watch={[loadData]}>
                <Grid item xs="auto">
                  <CreateAccountModal callback={loadData} />
                </Grid>
              </AllowedTo>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* filter */}
      {/* table */}
      <Grid item>
        <AlopayTable
          columns={columns}
          data={listing}
          pagination={{
            totalRecord,
            current: page,
            pageSize: pageSize,
            onChangePage: onChangePage,
            onChangePageSize: onChangePageSize,
          }}
          loading={loading}
        />
      </Grid>
      {/* table */}
      {showChangeStatusModal && (
        <ChangeStatusModal onClose={handleCloseModal} open={showChangeStatusModal} callback={loadData} />
      )}
    </Grid>
  );
};

export default React.memo(EWalletInfos);
