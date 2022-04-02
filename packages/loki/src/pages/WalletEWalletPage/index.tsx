import { Merchant } from '@mcuc/natasha/natasha_pb';
import { Grid } from '@material-ui/core';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import _isEmpty from 'lodash-es/isEmpty';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { getListMerchantsThunk } from 'redux/features/merchants/thunks';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import FormTabs from 'components/Tabs';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { APP_NAME } from 'utils/common';

import EWalletInfos from './EWalletInfos';
import styles from './styles.module.scss';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './const';

interface Props {}

const WalletEWalletPage = (props: Props) => {
  const dispatch = useDispatch();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/wallet/e-wallet',
        label: t('Wallet'),
      },
      {
        to: '/wallet/e-wallet',
        label: t('E-Wallet'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  const [urlParams, setUrlParams] = useUpdateUrlParams();

  const { merchant } = urlParams;

  const merchants = useSelector(selectDisplayMerchants);
  const tabList = React.useMemo(
    () =>
      merchants.map((x: Merchant.AsObject) => ({
        label: x.name,
        value: x.id,
        panel: null,
      })),
    [merchants],
  );
  const [merchantId, setMerchantId] = useState<number>(merchant ? +merchant : null);

  // push merchant to query
  const handleChangeMerchant = (event: React.ChangeEvent<{}>, merchantId: number) => {
    setMerchantId(merchantId);
    setUrlParams({ merchant: merchantId, page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE });
  };

  // set default merchant id - first time
  useEffect(() => {
    if (!_isEmpty(tabList)) {
      if (!merchantId) {
        setMerchantId(tabList[0]?.value);
      } else {
        const index = tabList.findIndex((x) => x.value === merchantId);
        if (index > -1) {
          setMerchantId(merchantId);
        } else {
          setMerchantId(tabList[0]?.value);
        }
      }
    }
  }, [merchantId, tabList]);

  // fetch list merchants
  useEffect(() => {
    dispatch(
      getListMerchantsThunk({
        page: 1,
        size: DEFAULT_PAGE_SIZE,
        keyword: '',
      }),
    );
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>{t('E-Wallet')} - {APP_NAME}</title>
      </Helmet>
      <LayoutContainer header={t('E-Wallet')} maxWidth={false}>
        <Grid container className={styles.root}>
          <Grid item xs={12}>
            <FormTabs currentTab={merchantId} tabList={tabList} onChange={handleChangeMerchant} />
            {merchantId && <EWalletInfos merchantId={merchantId} />}
          </Grid>
        </Grid>
      </LayoutContainer>
    </>
  );
};

export default WalletEWalletPage;
