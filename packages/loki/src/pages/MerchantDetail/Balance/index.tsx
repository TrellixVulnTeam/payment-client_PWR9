import i18n from 'i18n';
import { GetMerchantBalanceReply, Merchant } from '@mcuc/natasha/natasha_pb';
import { Box, Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import AllowedTo from 'components/AllowedTo';
import Alert from 'components/StyleGuide/Alert';
import MerchantBalance from 'components/Merchant/Balance';
import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { AlertTypes } from 'components/StyleGuide/Alert/types';

import { PerformPermission } from 'configs/routes/permission';
import { formatCurrency, getBalanceStatus } from 'utils/common';
import { CURRENCY_TYPE } from 'utils/constant/payment';

export const columnsDefine = [
  {
    Header: i18n.t('Date & time'),
    accessor: 'name',
    width: '200px',
  },
  {
    Header: i18n.t('Action'),
    accessor: 'id',
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    merchantTotal: {
      marginTop: theme.spacing(1),
    },
    totalItem: {
      height: '100%',
      padding: theme.spacing(3),
      border: '1px solid',
      borderColor: '#D6DEFF',
      backgroundColor: theme.palette.background.default,
    },
    totalTitle: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    buttonDetail: {
      padding: '0px',
    },
    alert: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

type BalanceProps = {
  merchant: Merchant.AsObject;
  balance: GetMerchantBalanceReply.AsObject;
};

const Balance: React.FC<BalanceProps> = ({ merchant, balance }) => {
  const { t } = useTranslation();

  const classes = useStyles();
  const history = useHistory();

  const balanceStatus = getBalanceStatus(balance.balance);

  const handleRedirectMoneyIn = () => {
    history.push(`/merchant/money/${merchant.id}`);
  };

  const handleRedirectMoneyOut = () => {
    history.push(`/merchant/money/${merchant.id}?tab=out`);
  };

  return (
    <>
      <Paper radius={PaperRadius.max}>
        <Box p={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant={TypoVariants.head2}>{t('Balance')} ({CURRENCY_TYPE.VND})</Typography>
              <Box mt={1}>
                <Typography variant={TypoVariants.body1} weight={TypoWeights.bold} type={TypoTypes.sub}>
                  {t('The balance is showing for real-time.')}
                </Typography>
              </Box>
            </Box>
            <Box>
              <MerchantBalance balance={balance.balance} />
            </Box>
          </Box>
          <Box className={classes.alert}>
            {balanceStatus === 'uneligible' && (
              <Alert type={AlertTypes.error}>
                <Typography variant={TypoVariants.body1} type={TypoTypes.error} weight={TypoWeights.bold}>
                  {t('The balance is {{status}}. Please add more deposit.', { status: t('uneligible') })}
                </Typography>
              </Alert>
            )}
            {balanceStatus === 'runningOut' && (
              <Alert type={AlertTypes.warning}>
                <Typography variant={TypoVariants.body1} type={TypoTypes.warning} weight={TypoWeights.bold}>
                  {t('The balance is {{status}}. Please add more deposit.', { status: t('Running out') })}
                </Typography>
              </Alert>
            )}
          </Box>
          <Grid container spacing={2} className={classes.merchantTotal}>
            <Grid item sm={12} md={6}>
              <Paper radius={PaperRadius.bold} background={PaperBackgrounds.ghost} className={classes.totalItem}>
                <Typography variant={TypoVariants.head3}>{t('Total money in')} ({CURRENCY_TYPE.VND})</Typography>
                <Box mt={1} mb={2}>
                  <Typography variant={TypoVariants.head1} type={TypoTypes.secondary}>
                    {formatCurrency(balance.totalMoneyIn)}
                  </Typography>
                </Box>
                <AllowedTo perform={PerformPermission.merchantMoneyIn.listPayments}>
                  <Button color="primary" className={classes.buttonDetail} onClick={handleRedirectMoneyIn}>
                    <Typography variant={TypoVariants.button1} type={TypoTypes.link}>
                      {t('View detail')}
                    </Typography>
                  </Button>
                </AllowedTo>
              </Paper>
            </Grid>
            <Grid item sm={12} md={6}>
              <Paper radius={PaperRadius.bold} background={PaperBackgrounds.ghost} className={classes.totalItem}>
                <Typography variant={TypoVariants.head3}>{t('Total money out')} ({CURRENCY_TYPE.VND})</Typography>
                <Box mt={1} mb={2}>
                  <Typography variant={TypoVariants.head1} type={TypoTypes.secondary}>
                    {formatCurrency(balance.totalMoneyOut)}
                  </Typography>
                </Box>
                <AllowedTo perform={PerformPermission.merchantMoneyOut.listPayments}>
                  <Button color="primary" className={classes.buttonDetail} onClick={handleRedirectMoneyOut}>
                    <Typography variant={TypoVariants.button1} type={TypoTypes.link}>
                      {t('View detail')}
                    </Typography>
                  </Button>
                </AllowedTo>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default Balance;
