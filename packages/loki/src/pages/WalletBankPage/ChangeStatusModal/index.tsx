import { BankStatus } from '@mcuc/stark/pepper_pb';
import { Grid, makeStyles, Theme } from '@material-ui/core';
import _get from 'lodash-es/get';
import cn from 'classnames';
import { useSelector } from 'react-redux';

import { Warning } from 'assets/icons/ILT';
import { useAppDispatch } from 'redux/store';
import { selectSelectedBankInfo } from 'redux/features/walletBanks/slice';
import { updateSystemBankAccountStatusThunk } from 'redux/features/walletBanks/thunks';

import Icon from 'components/StyleGuide/Icon';
import AlopayDialog from 'components/Dialog';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import ConfirmChangeStatusModalContent from './../ConfirmChangeStatusModalContent';
import styles from './styles.module.scss';
import { t } from 'i18next';

const useStyles = makeStyles<Theme>((theme) => ({
  btnError: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

interface Props {
  open: boolean;
  onClose: () => void;
  callback: () => void;
}

const defaultProps = {
  open: false,
};

const ChangeStatusModal = (props: Props) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const { open, onClose, callback } = { ...defaultProps, ...props };
  const selectedBankInfo = useSelector(selectSelectedBankInfo);
  const status = selectedBankInfo?.status; // current status

  async function handleSubmit() {
    const newStatus =
      status === BankStatus.BANK_STATUS_ACTIVE ? BankStatus.BANK_STATUS_IN_ACTIVE : BankStatus.BANK_STATUS_ACTIVE;

    const data = await dispatch(
      updateSystemBankAccountStatusThunk({
        id: selectedBankInfo.id,
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
      title={
        <Grid container spacing={2} alignItems="center" className={styles['root']}>
          <Grid item xs="auto" className={styles['inherit']}>
            <Icon
              className={cn({
                [styles['icon-active']]: selectedBankInfo?.status === BankStatus.BANK_STATUS_IN_ACTIVE,
                [styles['icon-inactive']]: selectedBankInfo?.status === BankStatus.BANK_STATUS_ACTIVE,
              })}
              component={Warning}
            />
          </Grid>
          <Grid item xs="auto">
            <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
              {selectedBankInfo?.status === BankStatus.BANK_STATUS_ACTIVE ? t('Active account') : t('Deactive account')}
            </Typography>
          </Grid>
        </Grid>
      }
      fullWidth
      open={open && !!selectedBankInfo}
      onClose={onClose}
      actions={
        <>
          <Button
            fullWidth
            size={ButtonSizes.lg}
            variant={status === BankStatus.BANK_STATUS_IN_ACTIVE ? ButtonVariants.primary : ButtonVariants.danger}
            className={status === BankStatus.BANK_STATUS_ACTIVE ? classes.btnError : classes.btnDefault}
            onClick={handleSubmit}
          >
            {status === BankStatus.BANK_STATUS_ACTIVE ? t('Deactive') : t('Active')}
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
