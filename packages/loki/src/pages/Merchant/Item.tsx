import { GetMerchantBalanceReply } from '@mcuc/natasha/natasha_pb';
import { t } from 'i18next';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import AllowedTo from 'components/AllowedTo';
import Avatar from 'components/StyleGuide/Avatar';
import MerchantBalance from 'components/Merchant/Balance';
import { AvatarSize } from 'components/StyleGuide/Avatar/type';
import { isLegalPermission } from 'components/AllowedTo/utils';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { gRPCMerchantsBalanceClient } from 'services/grpc/merchantBalance/client';
import { PerformPermission } from 'configs/routes/permission';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import useAuth from 'hooks/useAuth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      height: '100%',
      width: '100%',
      padding: theme.spacing(3),
    },
    cardContent: {
      padding: 0,
    },
    cardAvatar: {
      width: '64px',
      height: '64px',
    },
    cardActions: {
      padding: 0,
      marginTop: theme.spacing(3),
    },
    cardContentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    cardContentBalance: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(3),
    },
    buttonGoToMerchant: {
      padding: '0px',
    },
  }),
);

type MerchantItemProps = {
  title: string;
  id: number;
  logo: string;
};

const MerchantItem = ({ title, id, logo }: MerchantItemProps) => {
  const history = useHistory();
  const classes = useStyles();

  const { userPermissions } = useAuth();

  const [statusLoadingBalance, setStatusLoadingBalance] = React.useState('loading');
  const [balance, setBalance] = React.useState<GetMerchantBalanceReply.AsObject>({
    balance: 0,
    totalMoneyIn: 0,
    totalMoneyOut: 0,
    balanceForMexWithdrawProfit: 0,
    balanceForMexWithdrawFunds: 0,
    profit: 0,
  });

  React.useEffect(() => {
    async function fetchData() {
      setStatusLoadingBalance('loading');
      const { response } = await gRPCMerchantsBalanceClient.getMerchantBalance({
        merchantId: id,
      });

      if (response) {
        setBalance(response);
        setStatusLoadingBalance('idle');
      } else {
        setStatusLoadingBalance('error');
      }
    }

    setTimeout(() => {
      if (isLegalPermission(PerformPermission.merchantDetail.getMerchantBalance, userPermissions)) {
        fetchData();
      }
    }, 500);
  }, [id, userPermissions]);

  return (
    <Paper radius={PaperRadius.max}>
      <Box p={3}>
        <div className={classes.cardContentHeader}>
          <div>
            <Typography variant={TypoVariants.head2}>{title}</Typography>
            <Box mt={1}>
              <Typography variant={TypoVariants.body1} type={TypoTypes.sub} weight={TypoWeights.bold}>
                ID: {id}
              </Typography>
            </Box>
          </div>
          <div>
            <Avatar size={AvatarSize.large} src={logo}>
              {title ? title.slice(0, 1) : ''}
            </Avatar>
          </div>
        </div>
        <div className={classes.cardContentBalance}>
          <AllowedTo
            perform={PerformPermission.merchantDetail.getMerchantBalance}
            watch={[statusLoadingBalance, balance.balance]}
          >
            <Typography variant={TypoVariants.body1} type={TypoTypes.sub} weight={TypoWeights.bold}>
              {t('Balance')} ({CURRENCY_TYPE.VND})
            </Typography>
            {statusLoadingBalance === 'error' ? (
              <Typography variant={TypoVariants.head1} type={TypoTypes.error}>
                {t('Loading error')}
              </Typography>
            ) : statusLoadingBalance === 'loading' ? (
              <Typography variant={TypoVariants.head1} type={TypoTypes.sub}>
                {t('Loading...')}
              </Typography>
            ) : (
              <Box mt={1}>
                <MerchantBalance balance={balance.balance} />
              </Box>
            )}
          </AllowedTo>
        </div>
        <AllowedTo perform={PerformPermission.merchantDetail.getMerchant}>
          <Button
            color="primary"
            className={classes.buttonGoToMerchant}
            onClick={() => history.push(`/merchant/detail/${id}`)}
          >
            <Typography variant={TypoVariants.button1} type={TypoTypes.link}>
              {t('Go to merchant')}
            </Typography>
          </Button>
        </AllowedTo>
      </Box>
    </Paper>
  );
};

export default MerchantItem;
