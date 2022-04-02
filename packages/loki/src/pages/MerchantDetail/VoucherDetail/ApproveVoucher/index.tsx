import { PaymentType, SubmitVoucherRequest } from '@mcuc/natasha/natasha_pb';
import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import i18n from 'i18n';
import { t } from 'i18next';
import _get from 'lodash-es/get';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectVoucher } from 'redux/features/vouchers/slice';
import { getVoucherThunk, submitVoucherThunk } from 'redux/features/vouchers/thunks';
import { useAppDispatch } from 'redux/store';
import { UploadResponseResult } from 'services/restful/upload';
import Step1ConductVoucher from './Step1ConductVoucher';
import Step2ReviewConductVoucher from './Step2ReviewConductVoucher';

interface Props {}

const steps = [
  { label: i18n.t('Conduct'), component: Step1ConductVoucher },
  { label: i18n.t('Review'), component: Step2ReviewConductVoucher },
];

type UseFormValues = {
  payeeProvider: number;
  payeeAccount: string;
  payeeName: string;
  payerProvider: number;
  payerAccount: string;
  payerName: string;
  amount: number;
  txID: string;
  note: string;
  photo: UploadResponseResult;
};

const defaultValues = {
  photo: undefined,
};

const ApproveVoucher = (props: Props) => {
  const dispatch = useAppDispatch();
  const { voucherId } = useParams<{ voucherId: string }>();

  const voucher = useSelector(selectVoucher);

  const isReceiptVoucher =
    voucher?.type === PaymentType.MERCHANT_DEPOSIT_ADDITIONAL ||
    voucher?.type === PaymentType.MERCHANT_DEPOSIT_COMPENSATION;

  const [open, showModal] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [msgError, setMsgError] = useState(null);

  const methods = useForm<UseFormValues>({
    defaultValues: {
      ...defaultValues,
      amount: Math.abs(voucher.amount),
    },
  });
  const { handleSubmit, reset } = methods;

  const handleToggleModal = () => {
    if (open) {
      reset();
      handleFirst();
    }
    showModal(!open);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleFirst = () => {
    setActiveStep(0);
  };

  async function handleConfirm(data: UseFormValues) {
    const payload: SubmitVoucherRequest.AsObject = {
      id: voucher.id,
      // paymentId: voucher.id,
      payeeProvider: data.payeeProvider,
      payeeAccount: data.payeeAccount,
      payeeName: data.payeeName,
      payerProvider: data.payerProvider,
      payerAccount: data.payerAccount,
      payerName: data.payerName,
      txId: data.txID,
      handlerNote: data.note,
      imageUrl: data?.photo?.fullUrl,
    };
    const res = await dispatch(submitVoucherThunk(payload));
    const response = _get(res, 'payload.response');

    if (response) {
      dispatch(getVoucherThunk({ id: +voucherId }));
      showModal(false);
    } else {
      console.log('something when wrong with data', data);
      setMsgError(_get(data, 'payload.error.message'));
    }
    reset();
  }

  function handleCallback() {}

  const Component = steps[activeStep].component;
  return (
    <>
      <Button onClick={handleToggleModal}>{t('Submit')}</Button>
      {open && (
        <AlopayDialog
          maxWidth="md"
          preventClose={methods.formState.isDirty}
          title={t('Submit {{name}} Voucher', { name: isReceiptVoucher ? t('Receipt') : t('Payment') })}
          fullWidth
          open={open}
          steps={steps}
          activeStep={activeStep}
          handleBack={handleBack}
          onClose={handleToggleModal}
          errorMessage={msgError}
          actions={
            <>
              {activeStep === 0 && (
                <Button size={ButtonSizes.lg} onClick={handleSubmit(handleNext)}>
                  {t('Next to review')}
                </Button>
              )}
              {activeStep === 1 && (
                <Button size={ButtonSizes.lg} onClick={handleSubmit(handleConfirm)}>
                  {t('Confirm')}
                </Button>
              )}
            </>
          }
        >
          <FormProvider {...methods}>
            <Component
              onNext={handleNext}
              onBack={handleBack}
              onFirst={handleFirst}
              onClose={handleToggleModal}
              callback={handleCallback}
              msgError={msgError}
              isReceiptVoucher={isReceiptVoucher}
            />
          </FormProvider>
        </AlopayDialog>
      )}
    </>
  );
};

export default ApproveVoucher;
