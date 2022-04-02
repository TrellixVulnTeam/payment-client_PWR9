import Alert from '@material-ui/lab/Alert';
import { Box } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from 'redux/store';
import { submitResetPasswordThunk } from 'redux/features/auth/thunks';

import FormData from 'components/Form';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import useQuery from 'hooks/useQuery';
import useErrorMessage from 'hooks/useErrorMessage';
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

  const form = useForm({
    defaultValues: formFields,
  });

  const handleSubmit = async (data: FormFields) => {
    setFormFields(data);
    const { newPassword, confirmNewPassword } = data;
    if (newPassword !== confirmNewPassword) {
      form.setError('confirmNewPassword', {
        type: 'password',
        message: t('Password not match'),
      });
      return;
    }

    setLoading(true);

    const { response, error } = await dispatch(
      submitResetPasswordThunk({
        otp: query.get('otp'),
        otpId: query.get('otpId'),
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      }),
    ).unwrap();

    if (response) {
      history.push('/login');
      handleClose();
    }
    setError(error);
    setLoading(false);
  };

  return (
    <FormData
      methods={form}
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
              {t('Reset')}
            </Typography>
          </Button>
        </>
      }
    />
  );
}
