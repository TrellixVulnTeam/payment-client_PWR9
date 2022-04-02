import { Merchant } from '@mcuc/natasha/natasha_pb';
import { Grid } from '@material-ui/core';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import LayoutContainer from 'components/Layout/LayoutContainer';
import FormTabs from 'components/Tabs';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { t } from 'i18next';
import _isEmpty from 'lodash-es/isEmpty';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { getListMerchantsThunk } from 'redux/features/merchants/thunks';
import { APP_NAME } from 'utils/common';

import BankInfos from './BankInfos';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './const';
import styles from './styles.module.scss';

interface Props {}

const WalletBankPage = (props: Props) => {
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
        page: 1,
        size: DEFAULT_PAGE_SIZE,
        keyword: '',
      }),
    );
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>{t('Bank')} - {APP_NAME}</title>
      </Helmet>
      <LayoutContainer header={t('Bank')} maxWidth={false}>
        <Grid container className={styles.root}>
          <Grid item xs={12}>
            <FormTabs currentTab={merchantId} tabList={tabList} onChange={handleChangeMerchant} />
            {merchantId && <BankInfos merchantId={merchantId} />}
          </Grid>
        </Grid>
      </LayoutContainer>
    </>
  );
};

export default WalletBankPage;
