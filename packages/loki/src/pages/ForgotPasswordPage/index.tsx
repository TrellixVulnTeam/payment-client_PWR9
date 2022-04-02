import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from 'utils/common';
import Step1SendEmail from './Step1SendEmail';
import Step2CheckMail from './Step2CheckMail';

type FormFields = {
  email: string;
};

interface Props {}

export enum STEPS {
  'INITIAL' = 0,
  'SECURITY_CHECK' = 1,
  'CHECK_MAIL' = 2,
}

const ResetPasswordPage = (props: Props) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(STEPS.INITIAL);

  const methods = useForm<FormFields>({
    defaultValues: {
      email: '',
    },
  });

  const { getValues } = methods;
  const formFields = getValues();

  return (
    <>
      <Helmet>
        <title>{t('Forgot password')} - {APP_NAME}</title>
      </Helmet>
      <FormProvider {...methods}>
        {step === STEPS.INITIAL && <Step1SendEmail onCheckMail={() => setStep(STEPS.CHECK_MAIL)} />}
        {step === STEPS.CHECK_MAIL && (
          <Step2CheckMail email={formFields.email} onResend={() => setStep(STEPS.INITIAL)} />
        )}
      </FormProvider>
    </>
  );
};

export default ResetPasswordPage;
