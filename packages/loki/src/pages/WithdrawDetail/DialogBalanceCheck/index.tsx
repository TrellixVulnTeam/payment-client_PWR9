import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { GetMerchantBalanceReply } from '@mcuc/natasha/natasha_pb';
import { t } from 'i18next';
import i18n from 'i18n';
import Skeleton from '@material-ui/lab/Skeleton';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getMerchantBalanceThunk, getMerchantThunk } from 'redux/features/merchants/thunks';
import { approvePaymentWithdrawThunk, getPaymentDetailThunk } from 'redux/features/payments/thunks';
import { selectMerchantLoading, selectMerchantSelected } from 'redux/features/merchants/slice';

import FormData from 'components/Form';
import AlopayDialog from 'components/Dialog';
import AllowedTo from 'components/AllowedTo';
import StatusBalance from 'components/Status/Balance';
import { FormFields, FormTypes } from 'components/Form/types';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import useErrorMessage from 'hooks/useErrorMessage';
import { formatCurrency, MIN_BALANCE } from 'utils/common';
import {
  CURRENCY_TYPE,
  getListCheckPaymentMethod,
  getPaymentDetailAmount,
  getPermissionForRejectWithdraw,
} from 'utils/constant/payment';
import { MethodType } from '@mcuc/stark/stark_pb';
import { USDT_TO_VND } from 'utils/constant/crypto';

const steps = [{ label: i18n.t('User bank account') }, { label: i18n.t('Balance merchant') }];

type DialogApproveProps = {
  payment: GetPaymentDetailReply.AsObject;
  onClose: () => void;
  onOpenRefusedDialog: () => void;
};

type FormValues = {
  merchantId: number;
  merchantName: string;
  amountWithdraw: number;
  amountBeforeApproval: number;
  amountAfterApproval: number;
  note: string;
  eligible: 'eligible' | 'runningOut' | 'uneligible';
};

const calculateAmountWithdraw = (payment: GetPaymentDetailReply.AsObject) => {
  const isCrypto = payment.payment.method === MethodType.C;
  const amount = getPaymentDetailAmount(payment);
  const amountWithdraw = isCrypto ? amount * USDT_TO_VND : amount;
  return amountWithdraw;
};

const getStatusBalance = (
  payment: GetPaymentDetailReply.AsObject,
  balance: GetMerchantBalanceReply.AsObject | undefined,
) => {
  const amountWithdraw = calculateAmountWithdraw(payment);
  const accountBalance = balance?.balance || 0;
  if (accountBalance >= amountWithdraw) {
    if (accountBalance > MIN_BALANCE) {
      return 'eligible';
    } else {
      return 'runningOut';
    }
  } else {
    return 'uneligible';
  }
};

const DialogBalanceCheck: React.FunctionComponent<DialogApproveProps> = ({ payment, onClose, onOpenRefusedDialog }) => {
  const dispatch = useAppDispatch();

  const methods = useForm<FormValues>();

  const { reset, handleSubmit } = methods;

  const { isCrypto } = getListCheckPaymentMethod(payment.payment?.method);

  const { errorMessage, setError } = useErrorMessage();

  const [balance, setBalance] = React.useState<GetMerchantBalanceReply.AsObject>();
  const [statusLoading, setStatusLoading] = React.useState('idle');
  const [statusBalance, setStatusBalance] = React.useState<'eligible' | 'runningOut' | 'uneligible' | ''>('');

  const merchantLoading = useAppSelector(selectMerchantLoading);
  const merchant = useAppSelector(selectMerchantSelected);

  React.useEffect(() => {
    dispatch(
      getMerchantThunk({
        id: payment.payment.merchantId,
      }),
    );
  }, [dispatch, payment.payment.merchantId]);

  React.useEffect(() => {
    async function fetchData() {
      setStatusLoading('balancing');
      const { response } = await dispatch(
        getMerchantBalanceThunk({
          merchantId: payment.payment.merchantId,
        }),
      ).unwrap();

      if (response) {
        setBalance(response);
        setStatusBalance(getStatusBalance(payment, response));
      }
      setStatusLoading('idle');
    }
    fetchData();
  }, [dispatch, payment]);

  React.useEffect(() => {
    const paymentDetail = payment.payment;
    const amountWithdraw = calculateAmountWithdraw(payment);
    reset({
      eligible: 'eligible',
      merchantId: paymentDetail.merchantId,
      merchantName: merchantLoading ? t('Loading...') : merchant?.name ? merchant.name : t('Not found'),
      amountWithdraw: amountWithdraw,
      amountBeforeApproval: balance?.balance || 0,
      amountAfterApproval: (balance?.balance || 0) - amountWithdraw,
    });
  }, [reset, payment, balance, merchantLoading, merchant, isCrypto]);

  const handleBalanceCheck = async (data: FormValues) => {
    if (statusLoading === StatusEnum.LOADING) return;

    setStatusLoading('submitting');

    const { response, error } = await dispatch(
      approvePaymentWithdrawThunk({
        paymentId: payment.payment.id,
        method: payment.payment.method,
        note: data.note,
      }),
    ).unwrap();

    if (response) {
      onClose();
      dispatch(getPaymentDetailThunk({ id: Number(payment.payment.id) }));
    }

    if (error) {
      if (error.message && error.message.includes('INSUFFICIENT_BALANCE') && error.message.includes('1080001')) {
        setError({
          code: undefined,
          message: t('Third party Telco is insufficient balance'),
        });
      }
    } else {
      setError();
    }

    setStatusLoading('idle');
  };

  const fields: FormFields[] = [
    {
      label: `${t('Withdrawal amount')} (${CURRENCY_TYPE.VND})`,
      name: 'amountWithdraw',
      type: FormTypes.TYPOGRAPHY,
      formatValue: (value: number) => formatCurrency(value),
      width: { xs: 12 },
    },
    {
      label: t('Merchant'),
      name: 'merchantName',
      type: FormTypes.TYPOGRAPHY,
      width: { xs: 6 },
    },
    {
      label: `${t('Merchant')} ID`,
      name: 'merchantId',
      type: FormTypes.TYPOGRAPHY,
      width: { xs: 6 },
    },
    {
      label: `${t('Before approval')} (${CURRENCY_TYPE.VND})`,
      name: 'amountBeforeApproval',
      type: FormTypes.TYPOGRAPHY,
      formatValue: (value: number) => formatCurrency(value),
      width: { xs: 6 },
    },
    {
      label: `${t('After approval')} (${CURRENCY_TYPE.VND})`,
      name: 'amountAfterApproval',
      type: FormTypes.TYPOGRAPHY,
      formatValue: (value: number) => formatCurrency(value),
      width: { xs: 6 },
    },
    {
      label: `${t('Status')}`,
      name: 'status',
      type: FormTypes.COMPONENT,
      component: () => <StatusBalance value={statusBalance} />,
      width: { xs: 12 },
    },
    {
      label: `${t('Approval note')}`,
      name: 'note',
      placeholder: t('Type your note here'),
      type: FormTypes.TEXT_AREA,
      maxLength: 255,
      width: { xs: 12 },
      rows: 5,
    },
  ];

  const actions =
    statusBalance === 'uneligible' ? (
      <>
        <Button
          fullWidth
          size={ButtonSizes.lg}
          variant={ButtonVariants.danger}
          loading={statusLoading === 'submitting'}
          onClick={onOpenRefusedDialog}
        >
          <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
            {t('Reject')}
          </Typography>
        </Button>
        <Button fullWidth size={ButtonSizes.lg} variant={ButtonVariants.secondary} onClick={onClose}>
          <Typography variant={TypoVariants.button1}>{t('Cancel')}</Typography>
        </Button>
      </>
    ) : (
      <>
        <Button
          fullWidth
          size={ButtonSizes.lg}
          variant={ButtonVariants.primary}
          loading={statusLoading === 'submitting'}
          onClick={handleSubmit(handleBalanceCheck)}
        >
          {t('Approve')}
        </Button>
        <AllowedTo
          perform={getPermissionForRejectWithdraw(payment.payment?.method)}
          renderYes={() => (
            <Button fullWidth size={ButtonSizes.lg} variant={ButtonVariants.danger} onClick={onOpenRefusedDialog}>
              {t('Reject')}
            </Button>
          )}
          renderNo={() => (
            <Button fullWidth size={ButtonSizes.lg} variant={ButtonVariants.secondary} onClick={onClose}>
              {t('Cancel')}
            </Button>
          )}
        />
      </>
    );

  return (
    <AlopayDialog
      preventClose={methods.formState.isDirty}
      title={t('Balance Check')}
      onClose={onClose}
      steps={steps}
      errorMessage={errorMessage}
      actions={statusLoading === 'balancing' ? null : actions}
    >
      {!statusBalance ? (
        <>
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
          <Skeleton animation="wave" height={40} />
        </>
      ) : (
        <FormData methods={methods} fields={fields} />
      )}
    </AlopayDialog>
  );
};

export default DialogBalanceCheck;
