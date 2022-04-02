import { iToast } from '@ilt-core/toast';
import { Box, Grid } from '@material-ui/core';
import { t } from 'i18next';
import React, { useMemo, useState } from 'react';
import _isEmpty from 'lodash-es/isEmpty';

import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { importCryptoWalletsThunk } from 'redux/features/walletUMO/thunks';
import {
  selectListWalletDuplicatedImport,
  selectListWalletReadyImport,
  selectWalletUMOStatusImport,
} from 'redux/features/walletUMO/slice';

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
import { CryptoWallet } from '@mcuc/stark/ultron_pb';

interface Props {
  onNext: () => void;
  onBack: () => void;
  onFirst: () => void;
  onClose: () => void;
  callback?: () => void;
}

const defaultProps = {};

const StepTwoReviewUploadedCSV = (props: Props) => {
  const { onBack, onClose, callback } = { ...defaultProps, ...props };
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState(0);

  const { errorMessage, setError } = useErrorMessage();

  const listReady = useAppSelector(selectListWalletReadyImport);
  const listDuplicated = useAppSelector(selectListWalletDuplicatedImport);
  const statusImporting = useAppSelector(selectWalletUMOStatusImport);

  const list = currentTab === 1 ? listDuplicated : listReady;

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleChange = (_, tab) => setCurrentTab(tab);

  async function handleSubmit() {
    const { response, error } = await dispatch(
      importCryptoWalletsThunk({
        walletsList: list,
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
          <Box width="100%">
            <Grid container spacing={1} xs="auto">
              <Grid item xs="auto">
                <Typography
                  type={currentTab === 0 ? TypoTypes.link : TypoTypes.sub}
                  weight={TypoWeights.bold}
                  variant={TypoVariants.body1}
                >
                  {t('Ready to import')}
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <TotalCircle label={listReady.length} />
              </Grid>
            </Grid>
          </Box>
        ),
        value: 0,
        panel: null,
      },
      {
        label: (
          <Grid container spacing={1} xs="auto">
            <Grid item xs="auto">
              <Typography
                type={currentTab === 1 ? TypoTypes.link : TypoTypes.sub}
                weight={TypoWeights.bold}
                variant={TypoVariants.body1}
              >
                {t('Duplicated data')}
              </Typography>
            </Grid>
            <Grid item xs="auto">
              <TotalCircle label={listDuplicated.length} type={TypoTypes.error} />
            </Grid>
          </Grid>
        ),
        value: 1,
        panel: null,
      },
    ],
    [currentTab, listDuplicated.length, listReady.length],
  );

  const columns = useMemo(
    () => [
      {
        Header: t('Wallet ID'),
        accessor: (row: CryptoWallet.AsObject) => <ID value={row.id.toString()} />,
      },
      {
        Header: t('Wallet address'),
        accessor: (row: CryptoWallet.AsObject) => <ID value={row.address} />,
      },
      {
        Header: t('Coin'),
        accessor: (row: CryptoWallet.AsObject) => getCryptoType(row.cryptoType)?.name,
      },
      {
        Header: t('Network'),
        accessor: (row: CryptoWallet.AsObject) => getNetworkType(row.cryptoNetworkType)?.name,
      },
    ],
    [],
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
          {currentTab === 1 && (
            <Grid item>
              <Grid container wrap="nowrap">
                <Grid item xs="auto">
                  <Icon style={{ color: '#F53131' }} component={AlertCircle} width={20} height={20} />
                </Grid>
                <Grid item xs="auto">
                  <Box pl={0.5}>
                    <Typography variant={TypoVariants.body1} type={TypoTypes.error}>
                      {t(`These accounts are duplicated or used. You can't upload them. Please re-check`)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
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
      {errorMessage && (
        <Grid item>
          <Grid container alignItems="center" wrap="nowrap">
            <Grid item xs="auto">
              <Icon style={{ color: '#F53131' }} component={AlertCircle} width={20} height={20} />
            </Grid>
            <Grid item xs="auto">
              <Box pl={0.5}>
                <Typography variant={TypoVariants.body1} type={TypoTypes.error}>
                  {errorMessage}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid item>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Button size={ButtonSizes.lg} variant={ButtonVariants.secondary} onClick={handleBack}>
              {t('Back to import')}
            </Button>
          </Grid>
          {currentTab === 0 && !_isEmpty(listReady) && (
            <Grid item>
              <Button
                size={ButtonSizes.lg}
                onClick={handleSubmit}
                disabled={_isEmpty(listReady)}
                loading={statusImporting === StatusEnum.LOADING}
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
