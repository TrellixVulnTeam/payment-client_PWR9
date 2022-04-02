import { iToast } from '@ilt-core/toast';
import { Box, Grid } from '@material-ui/core';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';
import _isEmpty from 'lodash-es/isEmpty';
import _uniqBy from 'lodash-es/uniqBy';

import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';

import FormTabs from 'components/Tabs';
import Icon from 'components/StyleGuide/Icon';
import AlopayTable from 'components/AlopayTable';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { ID } from 'components/Table/lib';
import { Button, ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';

import useErrorMessage from 'hooks/useErrorMessage';
import { getCryptoType, getNetworkType } from 'utils/constant/crypto';
import AlertCircle from 'assets/icons/ILT/lib/AlertCircle';

import styles from './styles.module.scss';
import TotalCircle from '../TotalCircle';
import { importCryptoHotWalletsThunk } from 'redux/features/walletHotWallet/thunks';
import {
  selectCryptoHotWalletStatusImport,
  selectListHotWalletDuplicatedImport,
  selectListHotWalletInvalidImport,
  selectListHotWalletOverwriteImport,
  selectListHotWalletReadyImport,
} from 'redux/features/walletHotWallet/slice';
import { SystemCryptoHotWallet } from '@mcuc/stark/ultron_pb';
import { formatCurrency } from 'utils/common';
import { getMessageErrorFromHotWalletCode } from '../helper';

interface Props {
  onNext: () => void;
  onBack: () => void;
  onFirst: () => void;
  onClose: () => void;
  callback?: () => void;
}

const Tab = {
  READY: 'ready',
  INVALID: 'invalid',
  DUPLICATED: 'duplicated',
};

type MessageProps = {
  type: TypoTypes;
  message: string;
};

const Message: React.FC<MessageProps> = ({ type, message }) => {
  return (
    <Grid item>
      <Grid container wrap="nowrap">
        <Grid item xs="auto">
          {type === TypoTypes.error && (
            <Icon style={{ color: '#F53131' }} component={AlertCircle} width={20} height={20} />
          )}
          {type === TypoTypes.warning && (
            <Icon style={{ color: '#FFD52F' }} component={AlertCircle} width={20} height={20} />
          )}
        </Grid>
        <Grid item xs="auto">
          <Box pl={0.5}>
            <Typography variant={TypoVariants.body1} type={type}>
              {message}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

type TabLabelProps = {
  label: string;
  active: boolean;
  number: number;
  type: TypoTypes;
};

const TabLabel: React.FC<TabLabelProps> = ({ label, type, number, active }) => {
  return (
    <Grid container spacing={1} xs="auto">
      <Grid item xs="auto">
        <Typography
          type={active ? TypoTypes.link : TypoTypes.sub}
          weight={TypoWeights.bold}
          variant={TypoVariants.body1}
        >
          {label}
        </Typography>
      </Grid>
      <Grid item xs="auto">
        <TotalCircle label={number} type={type} />
      </Grid>
    </Grid>
  );
};

const defaultProps = {};

const StepTwoReviewUploadedCSV = (props: Props) => {
  const { onBack, onClose, callback } = { ...defaultProps, ...props };
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState(Tab.READY);
  const { errorMessage, setError } = useErrorMessage();
  const listReady = useAppSelector(selectListHotWalletReadyImport);
  const listDuplicated = useAppSelector(selectListHotWalletDuplicatedImport);
  const listInvalid = useAppSelector(selectListHotWalletInvalidImport);
  const listOverwrite = useAppSelector(selectListHotWalletOverwriteImport);
  const loading = useAppSelector(selectCryptoHotWalletStatusImport);
  const listOverwriteIds = useMemo(() => listOverwrite.map((item) => item.id), [listOverwrite]);
  const listReadyAndOverwrite = useMemo(
    () => _uniqBy([...listReady, ...listOverwrite], 'id'),
    [listReady, listOverwrite],
  );

  const list =
    currentTab === Tab.READY
      ? listReadyAndOverwrite
      : currentTab === Tab.INVALID
      ? listInvalid
      : currentTab === Tab.DUPLICATED
      ? listDuplicated
      : [];

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleChange = (_, tab) => setCurrentTab(tab);

  async function handleSubmit() {
    const { response, error } = await dispatch(
      importCryptoHotWalletsThunk({
        recordsList: list,
      }),
    ).unwrap();

    if (response) {
      if (onClose) {
        onClose();
      }
      if (callback) {
        callback();
      }
      iToast.success({
        title: t('Success'),
        msg: t('Import successfully'),
      });
    } else {
      console.log('something when wrong with data', error && error.message);
      iToast.error({
        title: t('Error'),
        msg: t('Something went wrong. Please re-check.'),
      });
    }
    setError(error);
  }

  const tabList = React.useMemo(
    () => [
      {
        label: (
          <TabLabel
            label={t('Ready to import')}
            number={listReadyAndOverwrite.length}
            type={TypoTypes.success}
            active={currentTab === Tab.READY}
          />
        ),
        value: Tab.READY,
        panel: null,
      },
      {
        label: (
          <TabLabel
            label={t('Duplicated data')}
            number={listDuplicated.length}
            type={TypoTypes.warning}
            active={currentTab === Tab.DUPLICATED}
          />
        ),
        value: Tab.DUPLICATED,
        panel: null,
      },
      {
        label: (
          <TabLabel
            label={t('Invalid data')}
            number={listInvalid.length}
            type={TypoTypes.error}
            active={currentTab === Tab.INVALID}
          />
        ),
        value: Tab.INVALID,
        panel: null,
      },
    ],
    [currentTab, listDuplicated.length, listInvalid.length, listReadyAndOverwrite.length],
  );

  const columns = useMemo(
    () => [
      {
        Header: t('Wallet ID'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => {
          return listOverwriteIds.includes(row.id) ? (
            <Typography variant={TypoVariants.body1} type={TypoTypes.warning} weight={TypoWeights.bold}>
              {row.id} ({t('Overwrite')})
            </Typography>
          ) : (
            <Typography variant={TypoVariants.body1} type={TypoTypes.default} weight={TypoWeights.bold}>
              {row.id}
            </Typography>
          );
        },
      },
      {
        Header: t('Wallet address'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => <ID value={row.address} />,
      },
      {
        Header: t('Coin'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => getCryptoType(row.cryptoType)?.name,
      },
      {
        Header: t('Network'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => getNetworkType(row.cryptoNetworkType)?.name,
      },
      {
        Header: t('Balance'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => formatCurrency(row.balance),
      },
      {
        Header: t('Total balance'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => formatCurrency(row.totalBalance),
      },
      {
        Header: t('Reasons'),
        accessor: (row: SystemCryptoHotWallet.AsObject) => getMessageErrorFromHotWalletCode(row.errorCode),
        hidden: currentTab !== Tab.INVALID,
      },
    ],
    [listOverwriteIds, currentTab],
  );

  return (
    <Grid container direction="column" spacing={3} className={styles['root']}>
      <Grid item xs="auto">
        <Grid container spacing={2} xs="auto">
          <Grid item style={{ width: '100%' }}>
            <FormTabs currentTab={currentTab} tabList={tabList} onChange={handleChange} />
          </Grid>
        </Grid>
        <Grid container direction="column" spacing={3}>
          {currentTab === Tab.READY && listOverwrite.length > 0 && (
            <Message
              type={TypoTypes.warning}
              message={t(`The new data will be overwritten on the old ones. Please be careful.`)}
            />
          )}

          {currentTab === Tab.DUPLICATED && listDuplicated.length > 0 && (
            <Message
              type={TypoTypes.warning}
              message={t(`These accounts phone number are used. So you can’t import them. Please check and try again.`)}
            />
          )}

          {currentTab === Tab.INVALID && listInvalid.length > 0 && (
            <Message
              message={t(`These accounts are invalid. So you can’t import them. Please check and try again.`)}
              type={TypoTypes.error}
            />
          )}
          <Grid item>
            <Grid container spacing={1} direction="column">
              <Grid item>
                <AlopayTable columns={columns} data={list} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {errorMessage && currentTab === Tab.READY && (
        <Message message={t(`There was an error. Please try again`)} type={TypoTypes.error} />
      )}
      <Grid item>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Button size={ButtonSizes.lg} variant={ButtonVariants.secondary} onClick={handleBack}>
              {t('Back to import')}
            </Button>
          </Grid>
          {currentTab === Tab.READY && !_isEmpty(listReadyAndOverwrite) && (
            <Grid item>
              <Button
                size={ButtonSizes.lg}
                onClick={handleSubmit}
                disabled={_isEmpty(listReadyAndOverwrite)}
                loading={loading === StatusEnum.LOADING}
              >
                {t('Import')}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StepTwoReviewUploadedCSV;
