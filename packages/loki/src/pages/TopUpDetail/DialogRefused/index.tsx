import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import i18n from 'i18n';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { StatusEnum } from 'redux/constant';
import { useAppDispatch } from 'redux/store';
import { getPaymentDetailThunk, rejectPaymentTopUpThunk } from 'redux/features/payments/thunks';
import FormData from 'components/Form';
import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { FormFields, FormTypes } from 'components/Form/types';
import useErrorMessage from 'hooks/useErrorMessage';
import { getListCheckPaymentMethod } from 'utils/constant/payment';
import { sleep } from 'utils/common';

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
    value: '',
    name: i18n.t('Other reasons'),
  },
];

const reasonsTelco = [
  {
    value: 'Transfer content is not correct',
    name: i18n.t('Serial number or card id is not correct'),
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
    value: 'Transfer from different wallet',
    name: i18n.t('Transfer from different {{key}}', { key: t('Wallet') }),
  },
  {
    value: '',
    name: i18n.t('Other reasons'),
  },
];

const reasonsCrypto = [
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

const defaultValues = {
  reason: undefined,
  merchantCall: [],
};

const DialogRefused: React.FunctionComponent<DialogApproveProps> = ({ payment, onClose }) => {
  const dispatch = useAppDispatch();
  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'all',
  });
  const { handleSubmit, watch, setValue } = methods;
  const { setError, errorMessage } = useErrorMessage();

  const { isBank, isCrypto, isEWallet, isTelco } = getListCheckPaymentMethod(payment.payment?.method);

  const [statusLoading, setStatusLoading] = React.useState(StatusEnum.IDLE);
  const watchReason = watch('reason');

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
      name: 'otherReasons',
      label: t('Other reasons'),
      type: FormTypes.TEXT_AREA,
      maxLength: 255,
      placeholder: t('Fill your {{key}}', { key: t('Reason').toLowerCase() }),
      disabled: watchReason !== '',
      rules: {
        required: watchReason === '' && t('This field is required'),
      },
      width: { xs: 12 },
      rows: 5,
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
      rejectPaymentTopUpThunk({
        method: payment.payment.method,
        paymentId: payment.payment.id,
        note: data.reason || data.otherReasons,
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
      title={t('Reject The Payment')}
      subtitle={
        <Trans
          i18nKey={'You are in the process of disapproving order id <b>{{id}}</b>. Please choose a reason below'}
          values={{ id: payment.payment?.id }}
          components={{
            b: (
              <Typography
                component="span"
                type={TypoTypes.default}
                weight={TypoWeights.bold}
                variant={TypoVariants.body1}
              />
            ),
          }}
        />
      }
      onClose={onClose}
      steps={steps}
      errorMessage={errorMessage}
      preventClose={methods.formState.isDirty}
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
