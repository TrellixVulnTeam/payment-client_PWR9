import { Box, Grid, Link, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import _isEmpty from 'lodash-es/isEmpty';
import { iToast } from '@ilt-core/toast';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { StatusEnum } from 'redux/constant';
import { signInThunk } from 'redux/features/auth/thunks';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectAuthError, selectConfirmOtp, selectUserStatus } from 'redux/features/auth/slice';

import FormData from 'components/Form';
import Icon from 'components/StyleGuide/Icon';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import TypographyV2, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { FormFields, FormTypes } from 'components/Form/types';

import AlertCircle from 'assets/icons/ILT/lib/AlertCircle';
import { KEY_ACCESS_TOKEN } from 'services/grpc/abstract/gRPCClient';
import { HOME } from 'configs/routes/path';
import { APP_NAME } from 'utils/common';
import useQuery from 'hooks/useQuery';

type FormValues = {
  username: string;
  password: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      display: 'flex',
      justifyContent: 'center',
    },
    form: {
      padding: theme.spacing(4),
      [theme.breakpoints.up('sm')]: {
        width: '512px',
      },
    },
    forgotPasswordWrapper: {
      marginBottom: theme.spacing(2),
      display: 'flex',
      justifyContent: 'flex-start',
    },
    forgotPassword: {
      color: theme.palette.primary.main,
    },
  }),
);

const defaultValues = { username: '', password: '' };

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const history = useHistory();
  const query = useQuery();
  const methods = useForm<FormValues>({
    defaultValues,
  });

  const errorMessage = useAppSelector(selectAuthError);
  const confirmOtp = useAppSelector(selectConfirmOtp);
  const status = useAppSelector(selectUserStatus);
  const accessToken = localStorage.getItem(KEY_ACCESS_TOKEN);

  const errorCode = useMemo(() => (query.has('c') && query.get('c')) || '', [query.has('c')]); //eslint-disable-line

  useEffect(() => {
    if (accessToken) {
      history.push(HOME);
    }
  }, [accessToken, history]);

  useEffect(() => {
    errorCode &&
      iToast.error({
        title: t('Error'),
        msg: t(`ERROR.${errorCode}`),
      });
  }, [errorCode]); //eslint-disable-line

  useEffect(() => {
    if (confirmOtp) {
      history.push(`/verify?otpId=${confirmOtp.success.id}&expireTime=${confirmOtp.success.expiry}`);
    }
  }, [confirmOtp, history]);

  const handleLogin = async (formData: FormValues) => {
    await dispatch(
      signInThunk({
        password: formData.password,
        username: formData.username,
        deviceId: undefined,
        deviceName: undefined,
      }),
    ).unwrap();
  };

  function renderError() {
    if (_isEmpty(errorMessage)) return;

    return (
      <Box pb={1}>
        <Grid container wrap="nowrap">
          <Grid item xs="auto">
            <Icon style={{ color: '#F53131', width: 20, height: 20 }} component={AlertCircle} />
          </Grid>
          <Grid item xs="auto">
            <Box pt={0.3} pl={0.6}>
              <TypographyV2 variant={TypoVariants.body2} type={TypoTypes.error}>
                {errorMessage}
              </TypographyV2>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }

  const fields: FormFields[] = [
    {
      name: 'username',
      label: t('Username'),
      type: FormTypes.INPUT,
      placeholder: t('Fill your {{key}}', { key: t('Username').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
    },
    {
      name: 'password',
      label: t('Password'),
      type: FormTypes.INPUT_PASSWORD,
      placeholder: t('Fill your {{key}}', { key: t('Password').toLowerCase() }),
      width: { xs: 12 },
      rules: {
        required: t('This field is required'),
      },
    },
  ];

  if (accessToken) {
    return <></>;
  }

  return (
    <>
      <Helmet>
        <title>
          {t('Sign in')} - {APP_NAME}
        </title>
      </Helmet>
      <Paper radius={PaperRadius.max}>
        <Box className={classes.form}>
          <Box className={classes.title}>
            <TypographyV2 variant={TypoVariants.head1}>{t('Sign in')}</TypographyV2>
          </Box>
          <FormData
            methods={methods}
            fields={fields}
            onSubmit={handleLogin}
            actions={
              <>
                {renderError()}
                <Box className={classes.forgotPasswordWrapper}>
                  <Link component={RouterLink} to="/forgot-password">
                    <Typography variant="button">{t('Forgot password')}?</Typography>
                  </Link>
                </Box>
                <Box mt={1}>
                  <Button loading={status === StatusEnum.LOADING} type="submit" size={ButtonSizes.lg}>
                    {t('Sign in')}
                  </Button>
                </Box>
              </>
            }
          />
        </Box>
      </Paper>
    </>
  );
};

export default LoginPage;
