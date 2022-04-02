import { BankName, SubmitBankingWithdrawReply } from '@mcuc/stark/pepper_pb';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { CryptoWalletName, SubmitCryptoWithdrawReply } from '@mcuc/stark/ultron_pb';
import { t } from 'i18next';
import { MethodType } from '@mcuc/stark/stark_pb';
import i18n from 'i18n';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { StatusEnum } from 'redux/constant';
import { useAppDispatch } from 'redux/store';
import { getPaymentDetailThunk, submitPaymentWithdrawThunk } from 'redux/features/payments/thunks';

import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { getCurrencyType } from 'utils/constant/payment';
import { UploadResponseResult } from 'services/restful/upload';
import useErrorMessage from 'hooks/useErrorMessage';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import { sleep } from 'utils/common';

import BasicInfoForm from './step/BasicInfo';
import ReviewInfoForm from './step/ReviewInfo';

const steps = [{ label: i18n.t('Upload invoice') }, { label: i18n.t('Review') }];

enum STEPS {
  BASIC_INFO = 0,
  REVIEW_INFO = 1,
}

export type ConductPayment = {
  payerProvider: CryptoWalletName | BankName;
  payerAccount: string;
  payerName: string;
  amount: number;
  fee: number;
};

type DialogSubmitInvoiceProps = {
  conductPayment: ConductPayment;
  payment: GetPaymentDetailReply.AsObject;
  onClose: () => void;
};

type FormFields = {
  txId: string;
  txHash: string;
  note: string;
  reason: string;
  status: string;
  photo: UploadResponseResult;
};

const defaultValues = {
  txId: '',
  note: '',
  photo: undefined,
};

const DialogSubmitInvoice: React.FunctionComponent<DialogSubmitInvoiceProps> = ({
  conductPayment,
  payment,
  onClose,
}) => {
  const methods = useForm<FormFields>({ defaultValues });
  const { reset, handleSubmit } = methods;

  const { errorMessage, setError } = useErrorMessage();

  const [activeStep, setActiveStep] = useState(STEPS.BASIC_INFO);
  const [statusLoading, setStatusLoading] = useState(StatusEnum.IDLE);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleFinish = () => {
    // close modal
    onClose();
    // reset data
    resetFormData();
    // First step
    setActiveStep(0);
  };

  const resetFormData = () => {
    reset();
  };

  const dispatch = useAppDispatch();

  const handleSubmitInvoice = async (formFields: FormFields) => {
    setStatusLoading(StatusEnum.LOADING);

    let result: GRPCClientResponse<SubmitCryptoWithdrawReply.AsObject | SubmitBankingWithdrawReply.AsObject>;

    console.log({ formFields });

    if (payment.payment.method === MethodType.C) {
      result = await dispatch(
        submitPaymentWithdrawThunk({
          methodType: MethodType.C,
          paymentId: payment.payment.id,
          txHash: formFields.txId,
          note: formFields.note,
          imageUrl: formFields.photo.fullUrl,

          // * Conduct payment
          fee: conductPayment.fee,
          amount: conductPayment.amount,
          senderAddress: conductPayment.payerAccount,
        }),
      ).unwrap();
    }

    if (payment.payment.method === MethodType.T) {
      result = await dispatch(
        submitPaymentWithdrawThunk({
          methodType: MethodType.T,
          paymentId: payment.payment.id,
          txId: formFields.txId,
          note: formFields.note,
          imageUrl: formFields.photo.fullUrl,

          // * Conduct payment
          fee: conductPayment.fee,
          amount: conductPayment.amount,
          bankName: conductPayment.payerProvider as BankName,
          accountName: conductPayment.payerName,
          accountNumber: conductPayment.payerAccount,
        }),
      ).unwrap();
    }

    const { response, error } = result;

    // ! Wait for payment process to complete
    await sleep(3500);

    if (response) {
      handleFinish();
      dispatch(getPaymentDetailThunk({ id: Number(payment.payment.id) }));
    }

    if (error) {
      if (error.message?.toLowerCase().includes('insufficient balance')) {
        setError({
          code: undefined,
          message: t('Insufficient balance'),
        });
      } else if (error.message?.toLowerCase().includes('value must be greater than 0')) {
        setError({
          code: undefined,
          message: `${t('Amount must be greater than {{value}}', { value: 0 })} (${getCurrencyType(
            payment.payment?.method,
          )})`,
        });
      } else {
        setError({
          code: undefined,
          message: t(error.message),
        });
      }
    } else {
      setError(error);
    }

    setStatusLoading(StatusEnum.IDLE);
  };

  return (
    <AlopayDialog
      title={t('Submit Invoice')}
      steps={steps}
      activeStep={activeStep}
      onClose={onClose}
      handleBack={handleBack}
      preventClose={methods.formState.isDirty}
      errorMessage={errorMessage}
      actions={
        <>
          {activeStep === STEPS.BASIC_INFO && (
            <Button size={ButtonSizes.lg} variant={ButtonVariants.primary} onClick={handleSubmit(handleNext)}>
              <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                {t('Next to review')}
              </Typography>
            </Button>
          )}
          {activeStep === STEPS.REVIEW_INFO && (
            <Button
              fullWidth
              size={ButtonSizes.lg}
              loading={statusLoading === StatusEnum.LOADING}
              onClick={handleSubmit(handleSubmitInvoice)}
            >
              <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                {t('Submit')}
              </Typography>
            </Button>
          )}
        </>
      }
    >
      <FormProvider {...methods}>
        {activeStep === STEPS.BASIC_INFO && <BasicInfoForm payment={payment} />}
        {activeStep === STEPS.REVIEW_INFO && <ReviewInfoForm payment={payment} />}
      </FormProvider>
    </AlopayDialog>
  );
};

export default DialogSubmitInvoice;
