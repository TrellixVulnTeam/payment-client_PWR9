import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import ImagePaper from 'assets/images/check_mail.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      [theme.breakpoints.up('sm')]: {
        width: '450px',
      },
    },
    formWrapper: {
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(4),
    },
    wrapper: {
      paddingTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center',
    },
    imagePaper: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

type Step2CheckMailProps = {
  email: string;
  onResend: () => void;
};

const Step2CheckMail = ({ email, onResend }: Step2CheckMailProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();

  return (
    <>
      <Paper radius={PaperRadius.max} className={classes.formWrapper}>
        <Box className={classes.form}>
          <Box className={classes.imagePaper}>
            <img alt="paper" src={ImagePaper} />
          </Box>
          <Box textAlign="center" mt={2} mb={2}>
            <Typography variant={TypoVariants.head1}>{t('Check your mail')}</Typography>
          </Box>
          <Box textAlign="center" mb={3}>
            <Typography variant={TypoVariants.body1}>
              <Trans
                i18nKey={'The new password has been sent to your <b>{{email}}</b>. Please check it and re-login'}
                values={{
                  email: email,
                }}
                components={{
                  b: (
                    <Typography
                      component="span"
                      variant={TypoVariants.body1}
                      type={TypoTypes.primary}
                      weight={TypoWeights.bold}
                    ></Typography>
                  ),
                }}
              />
            </Typography>
          </Box>
          <Button variant={ButtonVariants.primary} size={ButtonSizes.lg} onClick={() => history.push('/login')}>
            {t('Back to Sign in')}
          </Button>
          <Box className={classes.wrapper}>
            <Box mt={1}>
              <Typography variant={TypoVariants.body1} weight={TypoWeights.light} type={TypoTypes.sub}>
                {t('Didn’t receive the email?')}
              </Typography>
            </Box>
            <Box mt={1}>
              <Link component="button" onClick={onResend}>
                <Typography variant={TypoVariants.button1} type={TypoTypes.link}>
                  {t('Resend')}
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default Step2CheckMail;
