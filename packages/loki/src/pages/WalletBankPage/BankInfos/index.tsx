import { t } from 'i18next';
import { Box } from '@material-ui/core';
import { BankStatus, SystemBank } from '@mcuc/stark/pepper_pb';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  isFetchingList,
  selectBankInfos,
  selectTotalRecord,
  setSelectedBankInfo,
} from 'redux/features/walletBanks/slice';
import { listSystemBankAccountsThunk } from 'redux/features/walletBanks/thunks';

import AllowedTo from 'components/AllowedTo';
import FilterBar from 'components/FilterBar';
import Icon from 'components/StyleGuide/Icon';
import Grid from 'components/StyleGuide/Grid';
import AlopayTable from 'components/AlopayTable';
import Option from 'components/StyleGuide/Option';
import Toggle from 'components/StyleGuide/Toggle';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { ID } from 'components/Table/lib';
import { Input } from 'components/StyleGuide/Input';
import { DropdownList } from 'components/StyleGuide/DropdownList';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';

import useCheckbox from 'hooks/useCheckbox';
import useSearchKeyword from 'hooks/useSearchKeyword';
import useTablePagination from 'hooks/useTablePagination';

import { formatCurrency } from 'utils/common';
import { BANKS, getBank, CURRENCY_TYPE } from 'utils/constant/payment';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { PerformPermission } from 'configs/routes/permission';
import { Search } from 'assets/icons/ILT';
import ChangeStatusModal from './../ChangeStatusModal';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './../const';
import CreateAccountModal from './../CreateAccountModal';
import ImportAccountModal from './../ImportAccountModal';
import styles from './styles.module.scss';
import { isLegalPermission } from 'components/AllowedTo/utils';
import useAuth from 'hooks/useAuth';

interface Props {
  merchantId: number;
}

const statuses = [
  { name: t('All'), value: BankStatus.BANK_STATUS_UNSPECIFIED },
  { name: t('Active'), value: BankStatus.BANK_STATUS_ACTIVE },
  { name: t('Inactive'), value: BankStatus.BANK_STATUS_IN_ACTIVE },
];

const BankInfos = (props: Props) => {
  const { merchantId } = { ...props };
  const dispatch = useDispatch();

  const { userPermissions } = useAuth();

  // get query params
  const [showChangeStatusModal, toggleChangeStatusModal] = useState(false);

  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const { page, pageSize, onChangePage, onChangePageSize } = useTablePagination({
    defaultPage: DEFAULT_PAGE,
    defaultPageSize: DEFAULT_PAGE_SIZE,
  });

  const { keyword, onChangeKeyword, onKeyDownKeyword, onSubmitKeyword, onClearKeyword } = useSearchKeyword();

  const { status, bank_ids: bankIds, keyword: keywordParam } = urlParams;
  const statusParam = +status || BankStatus.BANK_STATUS_UNSPECIFIED;

  const defaultBankIds = bankIds ? bankIds.split(',') : [];

  const banksOptions = BANKS.map((item) => ({
    name: item.name,
    value: item.value.toString(),
  }));

  const {
    selected: selectedBanks,
    onChange: onChangeBanks,
    unselectAll: unselectAllBanks,
  } = useCheckbox(
    defaultBankIds,
    BANKS.map((item) => item.value.toString()),
    (banks) => handleSelectBanks(banks),
  );

  const bankInfos = useSelector(selectBankInfos);
  const totalRecord = useSelector(selectTotalRecord);
  const loading = useSelector(isFetchingList);

  useEffect(() => {
    if (showChangeStatusModal === false) {
      dispatch(setSelectedBankInfo(null));
    }
  }, [showChangeStatusModal, dispatch]);

  function handleCloseModal() {
    toggleChangeStatusModal(false);
  }

  const handleChangeStatus = (status) => {
    setUrlParams({ status, page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE });
  };

  const handleSelectBanks = (bankIds = []) => {
    setUrlParams({ bank_ids: bankIds.join(','), page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE });
  };

  const loadData = React.useCallback(
    ({ bankIds = selectedBanks, status: statusId = statusParam } = {}) => {
      dispatch(
        listSystemBankAccountsThunk({
          page: !!page ? page : 1,
          size: !!pageSize ? pageSize : DEFAULT_PAGE_SIZE,
          merchantIdsList: !!+merchantId ? [+merchantId] : [],
          bankNamesList: bankIds.map((x) => +x),
          idsList: !!+keywordParam ? [+keywordParam] : [],
          statuesList: !!+statusId ? [+statusId] : [],
        }),
      );
    },
    [dispatch, keywordParam, merchantId, page, pageSize, selectedBanks, statusParam],
  );

  useEffect(() => {
    if (merchantId > 0) {
      loadData();
    }
  }, [loadData, merchantId, bankIds, page, pageSize, statusParam]);

  const handleToggleStatus = useCallback(
    (e: React.SyntheticEvent, bankInfo: SystemBank.AsObject) => {
      e.preventDefault();
      toggleChangeStatusModal(true);
      dispatch(
        setSelectedBankInfo({
          data: bankInfo,
        }),
      );
    },
    [dispatch],
  );

  const columns = useMemo(
    () => [
      {
        Header: t('Account ID'),
        accessor: (row: SystemBank.AsObject) => <ID value={row.id.toString()} />,
      },
      {
        Header: t('Bank'),
        accessor: (row: SystemBank.AsObject) => getBank(row.bankName)?.name || '-',
      },
      {
        Header: t('Account number'),
        accessor: (row: SystemBank.AsObject) => row.accountNumber,
      },
      {
        Header: t('Account name'),
        accessor: (row: SystemBank.AsObject) => row.accountName,
      },
      {
        Header: t('Balance'),
        accessor: (row: SystemBank.AsObject) => formatCurrency(row.balance) || '-',
      },
      {
        Header: `${t('Current daily balance')} (${CURRENCY_TYPE.VND})`,
        accessor: (row: SystemBank.AsObject) => formatCurrency(row.dailyBalance) || '-',
      },
      {
        Header: `${t('Daily balance limit')} (${CURRENCY_TYPE.VND})`,
        accessor: (row: SystemBank.AsObject) => formatCurrency(row.dailyBalanceLimit) || '-',
      },
      {
        Header: `${t('Daily used amount')} (${CURRENCY_TYPE.VND})`,
        accessor: (row: SystemBank.AsObject) => formatCurrency(row.dailyUsedAmount) || '-',
      },
      {
        Header: t('Status'),
        accessor: (row: SystemBank.AsObject) => {
          return (
            <Box display="flex" alignItems="center">
              <Toggle
                checked={row.status === BankStatus.BANK_STATUS_ACTIVE}
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleStatus(e, row);
                }}
                style={{ marginRight: 10 }}
              />
              <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}>
                {row.status === BankStatus.BANK_STATUS_ACTIVE ? t('Active') : t('Inactive')}
              </Typography>
            </Box>
          );
        },
        hidden: !isLegalPermission(PerformPermission.walletBank.updateSystemBankAccountStatus, userPermissions),
      },
    ],
    [handleToggleStatus, userPermissions],
  );

  const handleClearFilter = () => {
    unselectAllBanks();
    onClearKeyword();
    clearUrlParams({
      ignoreParams: ['merchant'],
    });
  };

  const showReset = +status || !!keyword || selectedBanks.length;

  return (
    <Grid container direction="column" spacing={3}>
      {/* filter */}
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={true}>
            <FilterBar
              onClear={handleClearFilter}
              showReset={!!showReset}
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
                    <DropdownList value={statusParam} onChange={handleChangeStatus} className="custom-fit-content">
                      {statuses.map((item, idx) => (
                        <Option value={item.value} key={idx}>
                          {t(item.name)}
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
                      placeholder={t('Bank')}
                      selected={selectedBanks}
                      onChange={onChangeBanks}
                      onClear={unselectAllBanks}
                      options={banksOptions}
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
              <AllowedTo perform={PerformPermission.walletBank.importSystemBankAccount} watch={[loadData]}>
                <Grid item xs="auto">
                  <ImportAccountModal callback={loadData} />
                </Grid>
              </AllowedTo>
              <AllowedTo perform={PerformPermission.walletBank.createSystemBankAccount} watch={[loadData]}>
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
          data={bankInfos || []}
          pagination={{
            totalRecord,
            current: page,
            pageSize,
            onChangePage,
            onChangePageSize,
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

export default React.memo(BankInfos);
