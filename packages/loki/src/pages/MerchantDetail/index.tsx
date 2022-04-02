import { GetMerchantBalanceReply, Merchant } from '@mcuc/natasha/natasha_pb';
import { Avatar, Box, CircularProgress, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectMerchantLoading, selectMerchantSelected } from 'redux/features/merchants/slice';
import { getMerchantBalanceThunk, getMerchantThunk } from 'redux/features/merchants/thunks';

import AllowedTo from 'components/AllowedTo';
import LayoutContainer from 'components/Layout/LayoutContainer';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { isLegalPermission } from 'components/AllowedTo/utils';

import useUsersMap from 'hooks/useUsersMap';
import { APP_NAME, getColorWithCharacter } from 'utils/common';
import { PerformPermission } from 'configs/routes/permission';

import MerchantBalance from './Balance';
import MerchantVoucher from './MerchantVoucher';
import MerchantInformation from './Information';
import useAuth from 'hooks/useAuth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    merchantHeader: {
      display: 'flex',
      alignItems: 'center',
    },
    merchantLogo: {
      width: '120px',
      height: '120px',
      fontSize: '60px',
      fontWeight: 600,
      marginRight: theme.spacing(3),
    },
  }),
);

type MerchantHeaderProps = {
  merchant: Merchant.AsObject;
};

const MerchantHeader = ({ merchant }: MerchantHeaderProps) => {
  const classes = useStyles();
  return (
    <div className={classes.merchantHeader}>
      <Avatar
        className={classes.merchantLogo}
        src={merchant.logoPath}
        style={{ backgroundColor: getColorWithCharacter(merchant.name) }}
      >
        {merchant.name ? merchant.name[0] : '-'}
      </Avatar>
      <div>
        <Typography variant={TypoVariants.head1}>{merchant.name}</Typography>
        <Box mt={1}>
          <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
            ID: {merchant.id}
          </Typography>
        </Box>
      </div>
    </div>
  );
};

const MerchantDetail = () => {
  const { t } = useTranslation();

  const { userPermissions } = useAuth();

  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const merchant = useAppSelector(selectMerchantSelected);
  const merchantLoading = useAppSelector(selectMerchantLoading);

  const [statusLoadingBalance, setStatusLoadingBalance] = useState(false);
  const [balance, setBalance] = useState<GetMerchantBalanceReply.AsObject>();
  const { setBreadcrumbs } = useBreadcrumbs();

  useUsersMap([Number(merchant?.createdBy)]);

  useEffect(() => {
    if (!!merchant) {
      const breadcrumbs: IBreadcrumb[] = [
        {
          to: '/merchant',
          label: t('Merchant'),
        },
        {
          to: ``,
          label: merchant.name,
          active: true,
        },
      ];
      setBreadcrumbs(breadcrumbs);
    }
  }, [setBreadcrumbs, merchant, t]);

  useEffect(() => {
    dispatch(getMerchantThunk({ id: +id }));
  }, [dispatch, id]);

  useEffect(() => {
    async function fetchData() {
      setStatusLoadingBalance(true);
      const { response } = await dispatch(
        getMerchantBalanceThunk({
          merchantId: +id,
        }),
      ).unwrap();

      if (response) {
        setBalance(response);
      }
      setStatusLoadingBalance(false);
    }

    if (isLegalPermission(PerformPermission.merchantDetail.getMerchantBalance, userPermissions)) {
      fetchData();
    }
  }, [dispatch, userPermissions, id]);

  return (
    <>
      <Helmet>
        <title>
          {t('Merchant')} - {APP_NAME}
        </title>
      </Helmet>
      {merchantLoading || statusLoadingBalance ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        merchant && (
          <LayoutContainer center maxWidth="lg" header={<MerchantHeader merchant={merchant} />}>
            <Grid container spacing={3}>
              <AllowedTo perform={PerformPermission.merchantDetail.getMerchantBalance} watch={[merchant, balance]}>
                <Grid xs={12} item>
                  {balance && <MerchantBalance merchant={merchant} balance={balance} />}
                </Grid>
                <Grid item xs={12}>
                  {balance && <MerchantVoucher balance={balance} />}
                </Grid>
              </AllowedTo>
              <Grid xs={12} item>
                <MerchantInformation merchant={merchant} />
              </Grid>
            </Grid>
          </LayoutContainer>
        )
      )}
    </>
  );
};

export default MerchantDetail;
