import { t } from 'i18next';
import i18n from 'i18n';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import React from 'react';
import { useAppDispatch } from 'redux/store';
import { StatusEnum } from 'redux/constant';
import { useForm } from 'react-hook-form';
import { getPaymentDetailThunk, rejectPaymentWithdrawThunk } from 'redux/features/payments/thunks';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import FormData from 'components/Form';
import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { FormFields, FormTypes } from 'components/Form/types';
import useErrorMessage from 'hooks/useErrorMessage';
import { Trans } from 'react-i18next';

const steps = [{ label: i18n.t('Upload receipt') }, { label: i18n.t('Review') }];

type FormValues = {
  note: string;
  merchantCall: string[];
};

type DialogEditStatusProps = {
  payment: GetPaymentDetailReply.AsObject;
  onClose: () => void;
};

const schema = yup.object().shape({
  reason: yup.string(),
  note: yup
    .string()
    .max(11, t('Handler note must be at most {{number}} characters', { number: 11 }))
    .when('reason', {
      is: (reason: string) => reason === '',
      then: yup.string().required(t('This field is required')),
    }),
});

const defaultValues = {
  note: undefined,
  merchantCall: [],
};

const DialogEditStatus: React.FunctionComponent<DialogEditStatusProps> = ({ payment, onClose }) => {
  const dispatch = useAppDispatch();

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const { handleSubmit } = methods;

  const { errorMessage, setError } = useErrorMessage();

  const [statusLoading, setStatusLoading] = React.useState(StatusEnum.IDLE);

  const fields: FormFields[] = [
    {
      label: t('Handler note'),
      name: 'note',
      type: FormTypes.TEXT_AREA,
      placeholder: t('Type your note here'),
      maxLength: 255,
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

  const handleConfirm = async (data: FormValues) => {
    if (statusLoading === StatusEnum.LOADING) {
      return;
    }
    setStatusLoading(StatusEnum.LOADING);
    const { error, response } = await dispatch(
      rejectPaymentWithdrawThunk({
        paymentId: payment.payment.id,
        method: payment.payment.method,
        note: data.note,
        isMerchantCall: data.merchantCall.length > 0,
      }),
    ).unwrap();

    if (response) {
      onClose();
      dispatch(getPaymentDetailThunk({ id: Number(payment.payment.id) }));
    }
    setError(error);
    setStatusLoading(StatusEnum.IDLE);
  };

  return (
    <div>
      <AlopayDialog
        fullWidth
        title={t('Edit status')}
        subtitle={
          <Trans
            i18nKey="Are you sure to reject the withdraw payment ID <b>{{id}}</b>?"
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
        actions={
          <>
            <Button
              fullWidth
              type="submit"
              variant={ButtonVariants.danger}
              size={ButtonSizes.lg}
              loading={statusLoading === StatusEnum.LOADING}
              onClick={handleSubmit(handleConfirm)}
            >
              {t('Confirm')}
            </Button>
            <Button fullWidth variant={ButtonVariants.secondary} size={ButtonSizes.lg} onClick={onClose}>
              {t('Cancel')}
            </Button>
          </>
        }
      >
        <FormData methods={methods} fields={fields} />
      </AlopayDialog>
    </div>
  );
};

export default DialogEditStatus;
