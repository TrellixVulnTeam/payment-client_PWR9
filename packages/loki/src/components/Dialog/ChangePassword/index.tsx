import { t } from 'i18next';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StatusEnum } from 'redux/constant';
import { useAppDispatch } from 'redux/store';
import { changePasswordThunk } from 'redux/features/auth/thunks';

import FormData from 'components/Form';
import AlopayDialog from 'components/Dialog';
import { InputSizes } from 'components/StyleGuide/Input';
import { FormFields, FormTypes } from 'components/Form/types';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoVariants, TypoTypes, TypoWeights } from 'components/StyleGuide/Typography';
import { regexpPassword } from 'utils/common/password';
import useErrorMessage from 'hooks/useErrorMessage';

type DialogApproveProps = {
  onClose: () => void;
};

type UseFormValues = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

const DialogApprove: React.FunctionComponent<DialogApproveProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  const { setError, errorMessage } = useErrorMessage();

  const [statusSubmit, setStatusSubmit] = useState(StatusEnum.IDLE);

  const methods = useForm<UseFormValues>({
    defaultValues: {
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { getValues, handleSubmit } = methods;

  const fields: FormFields[] = [
    {
      name: 'currentPassword',
      label: t('Current password'),
      type: FormTypes.INPUT_PASSWORD,
      placeholder: t('Fill your {{key}}', { key: t('Current password').toLowerCase() }),
      width: { xs: 12 },
      size: InputSizes.lg,
      rules: { required: t('This field is required') },
    },
    {
      name: 'password',
      label: t('New password'),
      type: FormTypes.INPUT_PASSWORD,
      placeholder: t('Fill your {{key}}', { key: t('New password').toLowerCase() }),
      width: { xs: 12 },
      size: InputSizes.lg,
      validation: true,
      rules: {
        required: t('This field is required'),
        pattern: {
          value: regexpPassword,
          message: t('Password is wrong format'),
        },
      },
    },
    {
      name: 'confirmPassword',
      label: t('Confirm new password'),
      type: FormTypes.INPUT_PASSWORD,
      placeholder: t('Fill your {{key}}', { key: t('Password').toLowerCase() }),
      width: { xs: 12 },
      size: InputSizes.lg,
      rules: {
        required: t('This field is required'),
        validate: (value) => {
          return getValues('password') === value || t('Password not match');
        },
      },
    },
  ];

  const handleChangePassword = async (values: UseFormValues) => {
    if (statusSubmit === StatusEnum.LOADING) return;

    setStatusSubmit(StatusEnum.LOADING);

    const { response, error } = await dispatch(
      changePasswordThunk({
        currentPassword: values.currentPassword,
        newPassword: values.password,
        confirmNewPassword: values.confirmPassword,
      }),
    ).unwrap();
    if (response) {
      onClose();
    }
    setError(error);
    setStatusSubmit(StatusEnum.IDLE);
  };

  return (
    <AlopayDialog
      title={t('Change password')}
      onClose={onClose}
      errorMessage={errorMessage}
      preventClose={methods.formState.isDirty}
      maxWidth="sm"
      actions={
        <>
          <Button
            onClick={handleSubmit(handleChangePassword)}
            variant={ButtonVariants.primary}
            size={ButtonSizes.lg}
            loading={statusSubmit === StatusEnum.LOADING}
          >
            <Typography type={TypoTypes.invert} variant={TypoVariants.button1} weight={TypoWeights.medium}>
              {t('Change password')}
            </Typography>
          </Button>
          <Button variant={ButtonVariants.secondary} size={ButtonSizes.lg} onClick={onClose}>
            <Typography variant={TypoVariants.button1} weight={TypoWeights.medium}>
              {t('Cancel')}
            </Typography>
          </Button>
        </>
      }
    >
      <FormProvider {...methods}>
        <FormData methods={methods} fields={fields} />
      </FormProvider>
    </AlopayDialog>
  );
};

export default DialogApprove;
