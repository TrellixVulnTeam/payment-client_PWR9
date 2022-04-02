import { Merchant } from '@mcuc/natasha/natasha_pb';
import { Grid } from '@material-ui/core';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import _isEmpty from 'lodash-es/isEmpty';
import { useDispatch, useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { getListMerchantsThunk } from 'redux/features/merchants/thunks';

import FormTabs from 'components/Tabs';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { APP_NAME } from 'utils/common';

import { ALL_MERCHANT, DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './constants';
import WalletUMOContent from './Content';

interface Props {}

const WalletUMOPage = (props: Props) => {
  const dispatch = useDispatch();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/wallet/bank',
        label: t('Wallet'),
      },
      {
        to: '/wallet/bank',
        label: t('Bank'),
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
      [{ label: t('All'), value: ALL_MERCHANT, panel: null }].concat(
        merchants.map((x: Merchant.AsObject) => ({
          label: x.name,
          value: x.id,
          panel: null,
        })),
      ),
    [merchants],
  );
  const [merchantId, setMerchantId] = useState<number>(merchant ? +merchant : null);

  const handleChangeMerchant = (event: React.ChangeEvent<{}>, merchantId: number) => {
    setMerchantId(merchantId);
    setUrlParams({ merchant: merchantId, page: DEFAULT_PAGE });
  };

  useEffect(() => {
    if (!_isEmpty(tabList) && !merchantId) {
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

  useEffect(() => {
    dispatch(
      getListMerchantsThunk({
        page: DEFAULT_PAGE,
        size: DEFAULT_PAGE_SIZE,
        keyword: '',
      }),
    );
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>{t('UMO')} - {APP_NAME}</title>
      </Helmet>
      <LayoutContainer header={t('UMO')} maxWidth={false}>
        <Grid container>
          <Grid item xs={12}>
            <FormTabs currentTab={merchantId} tabList={tabList} onChange={handleChangeMerchant} />
            {merchantId && <WalletUMOContent merchantId={merchantId} />}
          </Grid>
        </Grid>
      </LayoutContainer>
    </>
  );
};

export default WalletUMOPage;
