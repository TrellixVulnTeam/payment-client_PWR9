import { t } from 'i18next';
import { PhoneNumber } from '@greyhole/myid/myid_pb';
import { iToast } from '@ilt-core/toast';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppDispatch } from 'redux/store';
import { StatusEnum } from 'redux/constant';
import { createServiceUserThunk } from 'redux/features/users/thunks';

import AlopayDialog from 'components/Dialog';
import { Button, ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';

import useErrorMessage from 'hooks/useErrorMessage';
import { parseJson } from 'utils/common';
import ReviewInfoForm from './step/ReviewInfo';
import BasicInfoForm from './step/BasicInfo';
import { STEPS } from './constant';

type DialogCreateUserProps = {
  onRefreshListUsers: () => void;
};

type UseFormValues = {
  roleId: number;
  groupId: number;
  email: string;
  fullName: string;
  phone: PhoneNumber.AsObject;
  role: string;
  username: string;
};

const defaultValues = {
  roleId: null,
  groupId: null,
  username: null,
  fullName: null,
  email: null,
  phone: {
    nationalNumber: null,
    countryCode: null,
  },
};

const DialogCreateUser: React.FunctionComponent<DialogCreateUserProps> = ({ onRefreshListUsers }) => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const steps = [{ label: t('Basic info') }, { label: t('Review info') }];

  const methods = useForm<UseFormValues>({
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(STEPS.BASIC_INFO);

  const { errorMessage, setError } = useErrorMessage();

  const [status, setStatus] = useState(StatusEnum.IDLE);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError();
    handleFirst();
    reset(defaultValues, { keepDirty: false });
  };

  const handleFinish = () => {
    handleClose();
    setError();
    onRefreshListUsers();
  };

  const handleCreate = async (data: UseFormValues) => {
    if (status === StatusEnum.LOADING) return;
    setStatus(StatusEnum.LOADING);
    const { response, error } = await dispatch(
      createServiceUserThunk({
        username: data.username,
        email: data.email,
        phoneNumber: {
          countryCode: data.phone.countryCode,
          nationalNumber: data.phone.nationalNumber,
        },
        metadata: JSON.stringify({
          fullName: data.fullName,
          picture: '',
        }),
        rolesList: [{ groupId: data.groupId, roleId: data.roleId }],
      }),
    ).unwrap();

    if (response) {
      handleFinish();

      const user = response.user;
      const userInfo = parseJson(response.user.metadata);

      history.push(`/user-info/${user.userId}`);

      iToast.success({
        title: t('Success'),
        msg: t(`You already have created the new user {{name}} successfully`, {
          name: userInfo.fullName || user.username,
        }),
      });
    } else {
      setError(error);
    }
    setStatus(StatusEnum.IDLE);
  };

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);
  const handleFirst = () => setActiveStep(STEPS.BASIC_INFO);

  return (
    <>
      <Button onClick={handleOpen}>
        <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
          {t('Create new {{key}}', { key: t('User').toLowerCase() })}
        </Typography>
      </Button>
      <AlopayDialog
        title={t('Create new {{key}}', { key: t('User').toLowerCase() })}
        open={open}
        steps={steps}
        activeStep={activeStep}
        preventClose={methods.formState.isDirty}
        onClose={handleClose}
        handleBack={handleBack}
        errorMessage={errorMessage}
        actions={
          <>
            {activeStep === STEPS.BASIC_INFO && (
              <Button size={ButtonSizes.lg} onClick={handleSubmit(handleNext)}>
                {t('Next to preview')}
              </Button>
            )}
            {activeStep === STEPS.REVIEW_INFO && (
              <Button
                fullWidth
                onClick={handleSubmit(handleCreate)}
                size={ButtonSizes.lg}
                loading={status === StatusEnum.LOADING}
              >
                <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                  {t('Confirm')} & {t('Create')}
                </Typography>
              </Button>
            )}
          </>
        }
      >
        <FormProvider {...methods}>
          {activeStep === STEPS.BASIC_INFO && <BasicInfoForm />}
          {activeStep === STEPS.REVIEW_INFO && <ReviewInfoForm />}
        </FormProvider>
      </AlopayDialog>
    </>
  );
};

export default DialogCreateUser;
