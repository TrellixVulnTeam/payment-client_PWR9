import { EWalletStatus, SystemEWallet } from '@mcuc/stark/tony_pb';
import { Grid, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import cn from 'classnames';
import React from 'react';
import { t } from 'i18next';
import { useSelector } from 'react-redux';
import _get from 'lodash-es/get';

import { useAppDispatch } from 'redux/store';
import { selectSelectedWalletInfo } from 'redux/features/walletEWallets/slice';
import { updateSystemEWalletStatusThunk } from 'redux/features/walletEWallets/thunks';

import Icon from 'components/StyleGuide/Icon';
import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { Warning } from 'assets/icons/ILT';

import ConfirmChangeStatusModalContent from './../ConfirmChangeStatusModalContent';

import styles from './styles.module.scss';


interface Props {
  open: boolean;
  onClose: () => void;
  callback: () => void;
}

const defaultProps = {
  open: false,
};

const useStyles = makeStyles<Theme>((theme) => ({
  btnError: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const ChangeStatusModal = (props: Props) => {
  const classes = useStyles();
  const { open, onClose, callback } = { ...defaultProps, ...props };
  const selectedWalletInfo = useSelector(selectSelectedWalletInfo);

  const dispatch = useAppDispatch();
  const selectedEWalletInfo: SystemEWallet.AsObject = useSelector(selectSelectedWalletInfo);
  const status = selectedEWalletInfo?.status; // current status

  async function handleSubmit() {
    const newStatus =
      status === EWalletStatus.EWALLET_ACTIVE ? EWalletStatus.EWALLET_IN_ACTIVE : EWalletStatus.EWALLET_ACTIVE;

    const data = await dispatch(
      updateSystemEWalletStatusThunk({
        id: selectedEWalletInfo.id,
        status: newStatus,
      }),
    );
    const response = _get(data, 'payload.response');
    if (response) {
      if (onClose) {
        onClose();
      }
      if (callback) {
        callback();
      }
    } else {
      console.log('something when wrong with data', data);
    }
  }

  return (
    <AlopayDialog
      // @ts-ignore
      title={
        <Grid container spacing={2} alignItems="center" className={styles['root']}>
          <Grid item xs="auto" className={styles['inherit']}>
            <Icon
              className={cn({
                [styles['icon-active']]: selectedWalletInfo?.status === EWalletStatus.EWALLET_IN_ACTIVE,
                [styles['icon-inactive']]: selectedWalletInfo?.status === EWalletStatus.EWALLET_ACTIVE,
              })}
              component={Warning}
            />
          </Grid>
          <Grid item xs="auto">
            <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
              {selectedWalletInfo?.status === EWalletStatus.EWALLET_IN_ACTIVE
                ? t('Active account')
                : t('Deactive account')}
            </Typography>
          </Grid>
        </Grid>
      }
      fullWidth
      open={open && !!selectedWalletInfo}
      onClose={onClose}
      actions={
        <>
          <Button
            fullWidth
            size={ButtonSizes.lg}
            variant={status === EWalletStatus.EWALLET_IN_ACTIVE ? ButtonVariants.primary : ButtonVariants.danger}
            className={status === EWalletStatus.EWALLET_ACTIVE ? classes.btnError : classes.btnDefault}
            onClick={handleSubmit}
          >
            {status === EWalletStatus.EWALLET_ACTIVE ? t('Deactive') : t('Active')}
          </Button>

          <Button fullWidth size={ButtonSizes.lg} variant={ButtonVariants.secondary} onClick={onClose} type="button">
            {t('Cancel')}
          </Button>
        </>
      }
    >
      <ConfirmChangeStatusModalContent />
    </AlopayDialog>
  );
};

export default ChangeStatusModal;
