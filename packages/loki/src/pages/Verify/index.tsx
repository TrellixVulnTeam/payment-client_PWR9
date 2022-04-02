import { Box, Paper, Icon } from '@material-ui/core';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from 'redux/store';
import { useTranslation } from 'react-i18next';
import { getAuthThunk } from 'redux/features/auth/thunks';
import { confirmSignInThunk, resendSignInOTPThunk } from 'redux/features/auth/thunks';

import useQuery from 'hooks/useQuery';
import useErrorMessage from 'hooks/useErrorMessage';

import OTPInput from 'components/OTPInput';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

import { APP_NAME, sleep } from 'utils/common';
import { HOME, LOGIN } from 'configs/routes/path';
import { Warning } from 'assets/icons/ILT';
import ImagePaper from 'assets/images/verify_your_sign_in.jpg';

import CountDown from './Countdown';

const OTP_LENGTH = 6;

enum StatusLoading {
  IDLE,
  VERIFYING,
  RESENDING,
}

const VerifyPage: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const history = useHistory();
  const query = useQuery();

  const EXPIRE_TIME = +query.get('expireTime');
  const otpParam = query.get('otp') || '';
  const otpIdParam = query.get('otpId');

  const buttonVerifyRef = useRef<HTMLButtonElement>();

  const [statusLoading, setStatusLoading] = useState<StatusLoading>(StatusLoading.IDLE);
  const [otpToSend, setOtpToSend] = useState<string>(otpParam);
  const [countDownFinish, setCountDownFinish] = useState<boolean>(false);
  const [expireTime, setExpireTime] = useState(EXPIRE_TIME);
  const [otpDisplay, setOtpDisplay] = useState(() => {
    if (otpParam && otpParam.length === OTP_LENGTH) {
      return [...otpParam];
    } else {
      return Array<string>(OTP_LENGTH).fill('');
    }
  });

  const { errorMessage, setError } = useErrorMessage();

  useEffect(() => {
    if (!otpIdParam) history.push(LOGIN);
  }, [otpIdParam, history]);

  useEffect(() => {
    if (otpToSend.length === OTP_LENGTH && !countDownFinish) {
      if (buttonVerifyRef.current) {
        buttonVerifyRef.current.click();
      }
    }
  }, [otpToSend, countDownFinish]);

  const handleConfirmSignIn = useCallback(async () => {
    setStatusLoading(StatusLoading.VERIFYING);

    await sleep(300);

    const { response, error } = await dispatch(confirmSignInThunk({ otp: otpToSend, otpId: otpIdParam })).unwrap();

    if (response) {
      history.push(HOME);

      // ! WARNING: Workaround
      /*  We need to call getAuthThunk to check permission before going to HOME
      But need to call getAuthThunk alter push to HOME because it causes Re-render in App causing Verify Page run again */
      return await dispatch(getAuthThunk());
    }

    setError(error);
    setStatusLoading(StatusLoading.IDLE);
  }, [dispatch, history, otpToSend, otpIdParam, setError]);

  const changeOtpToSend = (otp: string) => {
    setOtpToSend(otp);
  };

  const changeOtpDisplay = (otp: Array<string>) => {
    setOtpDisplay(otp);
  };

  const handleResend = async () => {
    if (!countDownFinish) return;

    setStatusLoading(StatusLoading.RESENDING);

    await sleep(300);

    const { response, error } = await dispatch(
      resendSignInOTPThunk({
        otpId: query.get('otpId'),
      }),
    ).unwrap();

    if (response) {
      setExpireTime(EXPIRE_TIME);
      setOtpToSend('');
      setCountDownFinish(false);
      setOtpDisplay(Array<string>(OTP_LENGTH).fill(''));
    }

    setError(error);
    setStatusLoading(StatusLoading.IDLE);
  };

  const handleCountdownFinish = () => {
    setCountDownFinish(true);
  };

  const isCanClick = otpToSend.length === OTP_LENGTH && !countDownFinish;

  return (
    <>
      <Helmet>
        <title>{t('Verify your sign in')} - {APP_NAME}</title>
      </Helmet>
      <Paper>
        <Box p={4}>
          <Box>
            <img alt="paper" src={ImagePaper} />
          </Box>
          <Box pt={3}>
            <Box mt={1} pb={1.5} textAlign="center">
              <Typography variant={TypoVariants.head1}>{t('Verify your sign in')}</Typography>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant={TypoVariants.body1} type={TypoTypes.sub}>
                {t('The OTP has been sent to your Email.')}
              </Typography>
              <Typography variant={TypoVariants.body1} type={TypoTypes.sub}>
                {t('Please check and input here')}
              </Typography>
            </Box>
            {!!EXPIRE_TIME && (
              <Box mt={3} className={`${countDownFinish}`}>
                <Typography align="center">
                  <CountDown
                    expiryTime={expireTime}
                    setExpireTime={setExpireTime}
                    countDownFinish={countDownFinish}
                    onCountdownFinish={handleCountdownFinish}
                  />
                </Typography>
              </Box>
            )}
            <Box display="flex" alignItems="center" flexDirection="column" mb={1}>
              <OTPInput
                autoFocus
                isNumberInput
                length={OTP_LENGTH}
                disabled={countDownFinish}
                otpDisplay={otpDisplay}
                onChangeOtpDisplay={changeOtpDisplay}
                onChangeOtpToSend={changeOtpToSend}
              />
              {errorMessage && (
                <Typography
                  component="span"
                  variant={TypoVariants.body1}
                  type={TypoTypes.error}
                  weight={TypoWeights.medium}
                >
                  <Icon component={Warning} style={{ marginRight: 8 }} />
                  {errorMessage}
                </Typography>
              )}
            </Box>
            <Box mt={1} mb={3} display="flex" justifyContent="center" alignItems="center">
              <Typography variant={TypoVariants.body1} weight={TypoWeights.medium} type={TypoTypes.sub}>
                {t('Didn’t receive the OTP code?')}{' '}
                <Typography
                  component="span"
                  variant={TypoVariants.body1}
                  weight={TypoWeights.bold}
                  type={countDownFinish ? TypoTypes.primary : TypoTypes.disable}
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={handleResend}
                >
                  {statusLoading === StatusLoading.RESENDING ? `${t('Resending')}...` : t('Resend')}
                </Typography>
              </Typography>
            </Box>
            <Button
              size={ButtonSizes.lg}
              loading={statusLoading === StatusLoading.VERIFYING}
              disabled={!isCanClick}
              onClick={handleConfirmSignIn}
              ref={buttonVerifyRef}
            >
              <Typography variant={TypoVariants.button1} weight={TypoWeights.medium} type={TypoTypes.invert}>
                {t('Verify')}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default VerifyPage;
