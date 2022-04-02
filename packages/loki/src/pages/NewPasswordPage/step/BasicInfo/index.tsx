import { iToast } from '@ilt-core/toast';
import Alert from '@material-ui/lab/Alert';
import { Box } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from 'redux/store';
import { useTranslation } from 'react-i18next';
import { createPasswordThunk } from 'redux/features/auth/thunks';

import FormData from 'components/Form';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import useErrorMessage from 'hooks/useErrorMessage';
import useQuery from 'hooks/useQuery';
import { APP_NAME } from 'utils/common';
import { fields } from './fields';

export interface FormFields {
  newPassword: string;
  confirmNewPassword: string;
}

export declare interface BasicInfoFormProps {
  handleClose: () => void;
  formFields: FormFields;
  setFormFields: (formFields: FormFields) => void;
}

export default function BasicInfoForm(props: BasicInfoFormProps) {
  const { t } = useTranslation();

  const { handleClose, formFields, setFormFields } = props;
  const query = useQuery();
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const { setError, errorMessage } = useErrorMessage();

  const methods = useForm({
    defaultValues: formFields,
  });

  useEffect(() => {
    if (!query.has('otpId') || !query.has('otp')) return history.push('/login');
  }, []); // eslint-disable-line

  const handleSubmit = async (data: FormFields) => {
    setFormFields(data);
    const { newPassword, confirmNewPassword } = data;
    if (newPassword !== confirmNewPassword) {
      methods.setError('confirmNewPassword', {
        type: 'password',
        message: t('Password not match'),
      });
      return;
    }

    setLoading(true);
    const { response, error } = await dispatch(
      createPasswordThunk({
        otp: query.get('otp'),
        otpId: query.get('otpId'),
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      }),
    ).unwrap();

    if (response) {
      handleClose();
      history.push('/login');
      iToast.success({
        title: 'Success',
        msg: t('Welcome you to join {{key}} platform. You already have activated your account successfully', {
          key: APP_NAME,
        }),
      });
    }
    setError(error);
    setLoading(false);
  };

  return (
    <FormData
      methods={methods}
      fields={fields}
      onSubmit={handleSubmit}
      actions={
        <>
          {errorMessage && (
            <Box mb={2}>
              <Alert severity="error">{errorMessage}</Alert>
            </Box>
          )}
          <Button size={ButtonSizes.lg} loading={loading} disabled={loading}>
            <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
              {t('Create & Sign in')}
            </Typography>
          </Button>
        </>
      }
    />
  );
}
