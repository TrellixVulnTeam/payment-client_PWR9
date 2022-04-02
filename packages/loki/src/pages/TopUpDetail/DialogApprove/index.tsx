import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { MethodType } from '@mcuc/stark/stark_pb';
import i18n from 'i18n';
import { t } from 'i18next';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StatusEnum } from 'redux/constant';
import { useAppDispatch } from 'redux/store';
import { approvePaymentTopUpThunk, getPaymentDetailThunk } from 'redux/features/payments/thunks';

import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { UploadResponseResult } from 'services/restful/upload';
import { sleep } from 'utils/common';
import useErrorMessage from 'hooks/useErrorMessage';

import BasicInfoForm from './step/BasicInfo';
import ReviewInfoForm from './step/ReviewInfo';
import { STEPS } from './constant';

const steps = [{ label: i18n.t('Upload receipt') }, { label: i18n.t('Review') }];

type DialogApproveProps = {
  payment: GetPaymentDetailReply.AsObject;
  onClose: () => void;
};

type UseFormValues = {
  txId: string;
  note: string;
  photo: UploadResponseResult;
  reason: string;
  status: string;
};

const defaultValues = {
  txId: '',
  note: '',
  photo: undefined,
};

const DialogApprove: React.FunctionComponent<DialogApproveProps> = ({ payment, onClose }) => {
  const dispatch = useAppDispatch();

  const methods = useForm<UseFormValues>({
    defaultValues,
  });

  const { handleSubmit, reset } = methods;

  const { setError, errorMessage } = useErrorMessage();

  const [statusLoading, setStatusLoading] = useState(StatusEnum.IDLE);
  const [activeStep, setActiveStep] = useState(STEPS.BASIC_INFO);

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
    reset({ txId: '', note: '' });
  };

  const handleApprove = async (data: UseFormValues) => {
    setStatusLoading(StatusEnum.LOADING);

    const { response, error } = await dispatch(
      approvePaymentTopUpThunk({
        method: payment.payment.method,
        paymentId: payment.payment.id,
        txId: data.txId,
        note: data.note,
        imageUrl: data.photo?.fullUrl || '',
      }),
    ).unwrap();

    // ! Wait for payment process to complete
    await sleep(3500);

    if (response) {
      handleFinish();
      dispatch(getPaymentDetailThunk({ id: Number(payment.payment.id) }));
    }

    setError(error);
    setStatusLoading(StatusEnum.IDLE);
  };

  const isTelco = payment.payment.method === MethodType.P;
  const isCrypto = payment.payment.method === MethodType.C;

  return (
    <AlopayDialog
      title={t('Approve The Payment')}
      activeStep={activeStep}
      steps={isTelco || isCrypto ? [] : steps}
      preventClose={methods.formState.isDirty}
      onClose={onClose}
      handleBack={handleBack}
      errorMessage={errorMessage}
      actions={
        <>
          {activeStep === STEPS.BASIC_INFO && (
            <>
              {isTelco || isCrypto ? (
                <Button
                  type="submit"
                  size={ButtonSizes.lg}
                  onClick={handleSubmit(handleApprove)}
                  loading={statusLoading === StatusEnum.LOADING}
                >
                  <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                    {t('Approve')}
                  </Typography>
                </Button>
              ) : (
                <Button type="submit" size={ButtonSizes.lg} onClick={handleSubmit(handleNext)}>
                  <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                    {t('Next to review')}
                  </Typography>
                </Button>
              )}
            </>
          )}
          {activeStep === STEPS.REVIEW_INFO && (
            <Button
              size={ButtonSizes.lg}
              onClick={handleSubmit(handleApprove)}
              loading={statusLoading === StatusEnum.LOADING}
            >
              <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                {t('Approve')}
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

export default DialogApprove;
