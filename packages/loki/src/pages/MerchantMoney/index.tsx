import { Merchant } from '@mcuc/natasha/natasha_pb';
import { Avatar } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { t } from 'i18next';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'redux/reducers';
import { useAppDispatch } from 'redux/store';
import { getMerchantThunk } from 'redux/features/merchants/thunks';

import Tab from 'components/Tabs/Tab';
import Tabs from 'components/Tabs/Tabs';
import TabPanel from 'components/Tabs/TabPanel';
import Grid from 'components/StyleGuide/Grid';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { PerformPermission } from 'configs/routes/permission';
import useAuth from 'hooks/useAuth';
import { APP_NAME } from 'utils/common';

import Filter from './Filter';
import MoneyIn from './MoneyIn';
import MoneyOut from './MoneyOut';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    merchantHeader: {
      display: 'flex',
      alignItems: 'center',
    },
    merchantLogo: {
      width: '120px',
      height: '120px',
      marginRight: theme.spacing(3),
    },
  }),
);

type MerchantHeaderProps = {
  merchant: Merchant.AsObject;
};

export const MerchantHeader: React.FC<MerchantHeaderProps> = ({ merchant }) => {
  const classes = useStyles();

  if (!merchant) return null;
  return (
    <div className={classes.merchantHeader}>
      <Avatar className={classes.merchantLogo} src={merchant.logoPath}>
        <Typography weight={TypoWeights.bold} variant={TypoVariants.head2} type={TypoTypes.invert}>
          {merchant.name.charAt(0)}
        </Typography>
      </Avatar>
      <div>
        <Typography component="h1" weight={TypoWeights.bold} variant={TypoVariants.head1} truncate={1}>
          {merchant.name}
        </Typography>
        <Typography weight={TypoWeights.bold} variant={TypoVariants.body1} type={TypoTypes.titleSub}>
          ID: {merchant.id}
        </Typography>
      </div>
    </div>
  );
};

const MerchantMoney: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const [urlParams, setUrlParams] = useUpdateUrlParams();

  const { userPermissions } = useAuth();

  const { setBreadcrumbs } = useBreadcrumbs();

  const merchant = useSelector((state: RootState) => state.merchants.selected);

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/merchant',
        label: t('Merchant'),
      },
      {
        to: `/merchant/detail/${id}`,
        label: t(merchant?.name) || 'unknown',
      },
      {
        to: '',
        label: `${t('Balance detail')}`,
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, merchant, id]);

  React.useEffect(() => {
    dispatch(getMerchantThunk({ id: +id }));
  }, [dispatch, id]);

  const handleChange = (event: React.ChangeEvent<{}>, newTab: string) => {
    setUrlParams({
      tab: newTab,
    });
  };

  const tabList = [
    {
      label: t('Money in'),
      value: 'in',
      panel: <MoneyIn />,
      hidden: !isLegalPermission(PerformPermission.merchantMoneyIn.listPayments, userPermissions),
    },
    {
      label: t('Money out'),
      value: 'out',
      panel: <MoneyOut />,
      hidden: !isLegalPermission(PerformPermission.merchantMoneyOut.listPayments, userPermissions),
    },
  ].filter((item) => !item.hidden);

  if (!merchant || !tabList.length) return null;

  const { tab: tabParam = tabList[0]?.value } = urlParams;

  return (
    <>
      <Helmet>
        <title>
          {t('Merchant money')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer header={<MerchantHeader merchant={merchant} />} maxWidth={false}>
        <Grid container direction="column" spacing={6}>
          <Grid item>
            <Tabs value={tabParam} onChange={handleChange}>
              {tabList.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <Filter />
          </Grid>
          <Grid item>
            <Paper>
              {tabList.map((tab) => (
                <TabPanel key={tab.value} value={tab.value} index={tabParam} spacingBox={0}>
                  {tab.panel}
                </TabPanel>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </LayoutContainer>
    </>
  );
};

export default MerchantMoney;
