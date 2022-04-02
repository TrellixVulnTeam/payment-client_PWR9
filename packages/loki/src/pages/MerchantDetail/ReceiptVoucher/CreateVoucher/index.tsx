import { useTranslation } from 'react-i18next';
import { CreateVoucherRequest, GetMerchantBalanceReply, PaymentType } from '@mcuc/natasha/natasha_pb';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppDispatch } from 'redux/store';
import { createVoucherThunk } from 'redux/features/vouchers/thunks';
import { getMerchantBalanceThunk } from 'redux/features/merchants/thunks';

import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';

import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import Step1AddVoucherInfo from './Step1AddVoucherInfo';
import Step2Review from './Step2Review';

interface Props {
  callback?: () => void;
  VoucherOptions: { name: string; value: number }[];
  isPaymentVoucher?: boolean;
}

type UseFormValues = {
  time: Date;
  voucherAmount: string;
  voucherType: number;
  note: string;
  availableBalance: number;
};

const defaultValues = {
  time: new Date(),
  note: '',
};
const CreateVoucher = (props: Props) => {
  const { t } = useTranslation();

  const steps = [
    { label: t('Information'), component: Step1AddVoucherInfo },
    { label: t('Review'), component: Step2Review },
  ];

  const { VoucherOptions, isPaymentVoucher, callback } = { ...props };

  const methods = useForm<UseFormValues>({
    defaultValues,
  });
  const { handleSubmit, reset, getValues, setValue, watch, setError, formState, clearErrors } = methods;
  const { errors } = formState;
  const disabled = !_isEmpty(errors); 

  const formValues = getValues();

  const [open, setOpen] = useState(false);
  const toggleModal = () => setOpen(!open);
  const [activeStep, setActiveStep] = useState(0);

  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [msgError, setMsgError] = useState(null);
  const [balance, setBalance] = useState<GetMerchantBalanceReply.AsObject>();
  const watchVoucherType = watch('voucherType');
  const watchVoucherAmount = watch('voucherAmount');
  const availableBalance = _get(formValues, 'availableBalance', 0) || 0;
  const voucherAmount = _get(formValues, 'voucherAmount', 0) || 0;

  const handleValidateBalance = useCallback(
    (voucherType, voucherAmount, balance) => {
      if (voucherType === PaymentType.MERCHANT_WITHDRAW_PROFIT || voucherType === PaymentType.MERCHANT_WITHDRAW_FUNDS) {
        if (+voucherAmount > +balance) {
          setError('voucherAmount', {
            type: 'manual',
            message: t('Out of available balance'),
          });
        } else {
          clearErrors('voucherAmount');
        }
      }
    },
    [t, clearErrors, setError],
  );

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  useEffect(() => {
    if (!_isEmpty(balance) && watchVoucherType > 0) {
      let availableBalance = 0;
      if (watchVoucherType === PaymentType.MERCHANT_WITHDRAW_PROFIT) {
        availableBalance = balance.balanceForMexWithdrawProfit;
      }
      if (watchVoucherType === PaymentType.MERCHANT_WITHDRAW_FUNDS) {
        availableBalance = balance.balanceForMexWithdrawFunds;
      }
      setValue('availableBalance', availableBalance);
      handleValidateBalance(watchVoucherType, voucherAmount, availableBalance);
    }
  }, [balance, handleValidateBalance, setValue, voucherAmount, watchVoucherType]);

  useEffect(() => {
    handleValidateBalance(formValues.voucherType, watchVoucherAmount, availableBalance);
  }, [availableBalance, formValues.voucherType, handleValidateBalance, watchVoucherAmount]);

  useEffect(() => {
    async function fetchData() {
      const { response } = await dispatch(
        getMerchantBalanceThunk({
          merchantId: +id,
        }),
      ).unwrap();

      if (response) {
        setBalance(response);
      }
    }

    if (open) {
      fetchData();
    }
  }, [dispatch, id, open]);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleFirst = () => {
    setActiveStep(0);
  };

  function handleCloseModal() {
    setOpen(false);
    setMsgError(undefined);
    reset(defaultValues, { keepDirty: false });
    handleFirst();
  }

  const handleCallback = () => {
    if (callback) {
      callback();
    }
  };

  async function handleConfirm(data: UseFormValues) {
    const payload: CreateVoucherRequest.AsObject = {
      merchantId: +id,
      amount: +data.voucherAmount,
      type: data.voucherType,
      note: data.note,
    };
    const res = await dispatch(createVoucherThunk(payload));
    const response = _get(res, 'payload.response');
    if (response) {
      handleCloseModal();
      handleCallback();
    } else {
      console.log('something when wrong with data', data, res);
      setMsgError(_get(res, 'payload.error.message'));
    }
  }

  const Component = steps[activeStep].component;

  return (
    <>
      <Button onClick={toggleModal}>
        <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
          {t('Create new')}
        </Typography>
      </Button>
      {open && (
        <AlopayDialog
          maxWidth="md"
          preventClose={methods.formState.isDirty}
          title={t('Create New {{name}} Voucher', { name: isPaymentVoucher ? t('Payment') : t('Receipt') })}
          fullWidth
          open={open}
          steps={steps}
          activeStep={activeStep}
          handleBack={handleBack}
          onClose={handleCloseModal}
          errorMessage={msgError}
          actions={
            <>
              {activeStep === 0 && (
                <Button size={ButtonSizes.lg} onClick={handleSubmit(handleNext)} disabled={disabled}>
                  <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                    {t('Next to review')}
                  </Typography>
                </Button>
              )}
              {activeStep === 1 && (
                <Button size={ButtonSizes.lg} onClick={handleSubmit(handleConfirm)} disabled={disabled}>
                  <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                    {t('Confirm')}
                  </Typography>
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
              onClose={toggleModal}
              callback={handleCallback}
              balance={balance}
              msgError={msgError}
              isPaymentVoucher={isPaymentVoucher}
              VoucherOptions={VoucherOptions}
            />
          </FormProvider>
        </AlopayDialog>
      )}
    </>
  );
};

export default CreateVoucher;
