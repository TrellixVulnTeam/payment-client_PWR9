import Grid from '@material-ui/core/Grid';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import LayoutContainer from 'components/Layout/LayoutContainer';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { APP_NAME } from 'utils/common';
import MerchantItem from './Item';
import MerchantListHeader from './MerchantListHeader';
import { useMerchantListFetcher } from './useMerchantListFetcher';

const MerchantList = () => {
  const { t } = useTranslation();

  const merchants = useSelector(selectDisplayMerchants);
  const { setBreadcrumbs } = useBreadcrumbs();
  useMerchantListFetcher();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/merchant',
        label: t('Merchant'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [t, setBreadcrumbs]);

  return (
    <>
      <Helmet>
        <title>{t('Merchant')} - {APP_NAME}</title>
      </Helmet>
      <LayoutContainer header={<MerchantListHeader />} maxWidth={false}>
        <Grid container spacing={3}>
          {merchants.map((merchant) => (
            <Grid key={merchant.id} item xs={12} sm={6} lg={4} xl={3}>
              <MerchantItem id={merchant.id} title={merchant.name} logo={merchant.logoPath} />
            </Grid>
          ))}
        </Grid>
      </LayoutContainer>
    </>
  );
};

export default MerchantList;
