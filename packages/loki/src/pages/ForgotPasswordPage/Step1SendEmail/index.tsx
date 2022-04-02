import Alert from '@material-ui/lab/Alert';
import { Box } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch } from 'redux/store';
import { resetPasswordThunk } from 'redux/features/auth/thunks';

import FormData from 'components/Form';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';

import useErrorMessage from 'hooks/useErrorMessage';
import { APP_NAME, sleep } from 'utils/common';
import ImagePaper from 'assets/images/forgot_password.png';
import fields from './fields';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      display: 'flex',
      justifyContent: 'center',
    },
    form: {
      [theme.breakpoints.up('sm')]: {
        width: '450px',
      },
    },
    formWrapper: {
      padding: theme.spacing(4),
    },
    formImage: {
      width: '100%',
      margin: theme.spacing(1, 0),
      '& img': {
        width: '100%',
      },
    },
    formInput: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    formContent: {
      marginTop: theme.spacing(1),
    },
    button: {
      backgroundColor: theme.palette.primary.main,
      height: '48px',
      marginTop: theme.spacing(1),
    },
    text: {
      color: theme.palette.text.secondary,
      textAlign: 'center',
    },
  }),
);

type Props = {
  onCheckMail: () => void;
};

const Step1SendEmail = ({ onCheckMail }: Props) => {
  const { t } = useTranslation();

  const history = useHistory();

  const classes = useStyles();

  const dispatch = useAppDispatch();

  const methods = useFormContext();

  const { setError, errorMessage } = useErrorMessage();

  const [loading, setLoading] = useState('idle');

  const handleResetPassword = async (data) => {
    setLoading('loading');
    await sleep(500);
    const { response, error } = await dispatch(
      resetPasswordThunk({
        email: data.email,
        phoneNumber: '',
      }),
    ).unwrap();

    if (response) {
      onCheckMail();
    }
    setError(error);
    setLoading('idle');
  };

  return (
    <>
      <Helmet>
        <title>
          {t('Forgot password')} - {APP_NAME}
        </title>
      </Helmet>
      <Paper radius={PaperRadius.max} className={classes.formWrapper}>
        <Box className={classes.form}>
          <Box display="flex" justifyContent="center">
            <img alt="paper" src={ImagePaper} />
          </Box>
          <Box textAlign="center" mb={2} mt={4}>
            <Typography variant={TypoVariants.head1}>{t('Forgot password')} ?</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant={TypoVariants.body1} type={TypoTypes.sub}>
              {t(
                'Enter your email below, we’re going to send you instructions to reset your password through your email.',
              )}
            </Typography>
          </Box>
          <Box mt={3}>
            <FormData
              methods={methods}
              fields={fields}
              onSubmit={handleResetPassword}
              actions={
                <>
                  {errorMessage && (
                    <Box mb={2}>
                      <Alert severity="error">{errorMessage}</Alert>
                    </Box>
                  )}
                  <Button
                    type="submit"
                    loading={loading === 'loading'}
                    variant={ButtonVariants.primary}
                    size={ButtonSizes.lg}
                  >
                    <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                      {t('Send request')}
                    </Typography>
                  </Button>
                  <Button
                    variant={ButtonVariants.secondary}
                    size={ButtonSizes.lg}
                    onClick={() => history.push('/login')}
                  >
                    <Typography variant={TypoVariants.button1}>{t('Back to Sign in')}</Typography>
                  </Button>
                </>
              }
            />
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default Step1SendEmail;
