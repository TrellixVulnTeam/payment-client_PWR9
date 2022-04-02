import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import React, { useEffect, useMemo } from 'react';
import i18n from 'i18n';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
import { useForm } from 'react-hook-form';

import { StatusEnum } from 'redux/constant';
import { useAppDispatch } from 'redux/store';
import { getPaymentDetailThunk, rejectPaymentWithdrawThunk } from 'redux/features/payments/thunks';

import { sleep } from 'utils/common';
import useErrorMessage from 'hooks/useErrorMessage';

import FormData from 'components/Form';
import AlopayDialog from 'components/Dialog';
import { FormFields, FormTypes } from 'components/Form/types';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { getListCheckPaymentMethod } from 'utils/constant/payment';

const steps = [{ label: i18n.t('Upload receipt') }, { label: i18n.t('Review') }];

type FormValues = {
  reason: string;
  otherReasons: string;
  merchantCall: string[];
};

type DialogApproveProps = {
  payment: GetPaymentDetailReply.AsObject;
  onClose: () => void;
};

const defaultValues = {
  reason: undefined,
  merchantCall: [],
};

const reasonsBank = [
  {
    value: 'Transfer content is not correct',
    name: i18n.t('Transfer content is not correct'),
  },
  {
    value: 'Transfer from different Bank',
    name: i18n.t('Transfer from different {{key}}', { key: t('Bank') }),
  },
  {
    value: 'Merchant has not enough balance',
    name: i18n.t('Merchant has not enough balance'),
  },
  {
    value: '',
    name: i18n.t('Other reasons'),
  },
];

const reasonsTelco = [
  {
    value: 'Transfer content is not correct',
    name: i18n.t('Transfer content is not correct'),
  },
  {
    value: '3rd party service error',
    name: i18n.t('3rd party service error'),
  },
  {
    value: 'Merchant has not enough balance',
    name: i18n.t('Merchant has not enough balance'),
  },
  {
    value: '',
    name: i18n.t('Other reasons'),
  },
];

const reasonsEWallet = [
  {
    value: 'Transfer content is not correct',
    name: i18n.t('Transfer content is not correct'),
  },
  {
    value: '3rd party service error',
    name: i18n.t('3rd party service error'),
  },
  {
    value: 'Merchant has not enough balance',
    name: i18n.t('Merchant has not enough balance'),
  },
  {
    value: '',
    name: i18n.t('Other reasons'),
  },
];

const reasonsCrypto = [
  {
    value: 'Merchant has not enough balance',
    name: i18n.t('Merchant has not enough balance'),
  },
  {
    value: '',
    name: i18n.t('Other reasons'),
  },
];

const schema = yup.object().shape({
  reason: yup.string(),
  otherReasons: yup
    .string()
    .max(255, t('Other reasons must be at most {{number}} characters', { number: 255 }))
    .when('reason', {
      is: (reason: string) => reason === '',
      then: yup.string().required(t('This field is required')),
    }),
});

const DialogRefused: React.FunctionComponent<DialogApproveProps> = ({ payment, onClose }) => {
  const dispatch = useAppDispatch();

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const { watch, handleSubmit, setValue } = methods;

  const { errorMessage, setError } = useErrorMessage();

  const [statusLoading, setStatusLoading] = React.useState(StatusEnum.IDLE);
  const watchReason = watch('reason');

  const { isBank, isCrypto, isEWallet, isTelco } = getListCheckPaymentMethod(payment.payment?.method);

  const reasons = useMemo(
    () =>
      isBank
        ? reasonsBank
        : isTelco
        ? reasonsTelco
        : isEWallet
        ? reasonsEWallet
        : isCrypto
        ? reasonsCrypto
        : [
            {
              value: '',
              name: t('Other reasons'),
            },
          ],
    [isBank, isCrypto, isEWallet, isTelco],
  );

  useEffect(() => {
    setValue('reason', reasons[0].value);
  }, [setValue, reasons]);

  const fields: FormFields[] = [
    {
      name: 'reason',
      type: FormTypes.RADIO,
      width: { xs: 12 },
      options: reasons,
    },
    {
      label: t('Other reasons'),
      name: 'otherReasons',
      type: FormTypes.TEXT_AREA,
      maxLength: 255,
      placeholder: t('Type your {{key}} here', { key: t('Reason').toLowerCase() }),
      disabled: watchReason !== '',
      rows: 5,
      width: { xs: 12 },
    },
    {
      type: FormTypes.CHECKBOX,
      name: 'merchantCall',
      options: [
        {
          name: t('Merchant call'),
          value: '1',
        },
      ],
      width: { xs: 12 },
    },
  ];

  const handleReject = async (data: FormValues) => {
    if (statusLoading === StatusEnum.LOADING) {
      return;
    }
    setStatusLoading(StatusEnum.LOADING);
    const { error, response } = await dispatch(
      rejectPaymentWithdrawThunk({
        paymentId: payment.payment.id,
        note: data.reason || data.otherReasons,
        method: payment.payment.method,
        isMerchantCall: data.merchantCall.length > 0,
      }),
    ).unwrap();

    // ! Wait for payment process to complete
    await sleep(3500);

    if (response) {
      onClose();
      dispatch(getPaymentDetailThunk({ id: Number(payment.payment.id) }));
    }
    setError(error);
    setStatusLoading(StatusEnum.IDLE);
  };

  return (
    <AlopayDialog
      preventClose={methods.formState.isDirty}
      subtitle={
        <Trans
          i18nKey={'You are in the process of disapproving order id <b>{{id}}</b>. Please choose a reason below'}
          values={{ id: payment.payment?.id }}
          components={{
            b: (
              <Typography
                variant={TypoVariants.body1}
                component="span"
                type={TypoTypes.default}
                weight={TypoWeights.bold}
              />
            ),
          }}
        />
      }
      title={t('Reject The Order')}
      onClose={onClose}
      steps={steps}
      errorMessage={errorMessage}
      actions={
        <>
          <Button
            fullWidth
            type="submit"
            variant={ButtonVariants.danger}
            size={ButtonSizes.lg}
            loading={statusLoading === StatusEnum.LOADING}
            onClick={handleSubmit(handleReject)}
          >
            {t('Reject')}
          </Button>
          <Button fullWidth variant={ButtonVariants.secondary} size={ButtonSizes.lg} onClick={onClose}>
            {t('Cancel')}
          </Button>
        </>
      }
    >
      <FormData methods={methods} fields={fields} />
    </AlopayDialog>
  );
};

export default DialogRefused;
