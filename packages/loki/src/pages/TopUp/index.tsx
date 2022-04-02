import { Status } from '@mcuc/stark/stark_pb';
import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { t } from 'i18next';

import { useAppDispatch } from 'redux/store';
import { getListMerchantsThunk } from 'redux/features/merchants/thunks';
import FormTabs from 'components/Tabs';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { PAYMENT_TOPUP } from 'configs/routes/path';
import { APP_NAME } from 'utils/common';
import { STATUS_FAILED, DEFAULT_PAGE, DEFAULT_PAGESIZE } from './constants';
import ContentTopup from './Content';

const TopUp = () => {
  const dispatch = useAppDispatch();

  const { setBreadcrumbs } = useBreadcrumbs();

  const [urlParams, setUrlParams] = useUpdateUrlParams();
  const { status: statusParam = Status.CREATED } = urlParams;

  const [status, setStatus] = useState(+statusParam);

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: PAYMENT_TOPUP,
        label: t('Payment'),
      },
      {
        to: PAYMENT_TOPUP,
        label: t('Top-up'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  // push merchant to query
  const handleChangeStatus = (event: React.ChangeEvent<{}>, status: number) => {
    setUrlParams({
      status,
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGESIZE,
    });
    setStatus(status);
  };

  useEffect(() => {
    dispatch(
      getListMerchantsThunk({
        page: DEFAULT_PAGE,
        size: DEFAULT_PAGESIZE,
        keyword: '',
      }),
    );
  }, [dispatch]);

  const tabList = useMemo(
    () => [
      {
        label: t('New'),
        value: Status.CREATED,
        panel: null,
      },
      {
        label: t('Approved'),
        value: Status.APPROVED,
        panel: null,
      },
      {
        label: t('Completed'),
        value: Status.COMPLETED,
        panel: null,
      },
      {
        label: t('Rejected'),
        value: Status.REJECTED,
        panel: null,
      },
      {
        label: t('Failed'),
        value: STATUS_FAILED,
        panel: null,
      },
    ],
    [],
  );

  return (
    <>
      <Helmet>
        <title>{t('Top-up')} - {APP_NAME}</title>
      </Helmet>
      <LayoutContainer header={t('Top-up')} maxWidth={false}>
        <FormTabs tabList={tabList} currentTab={status} onChange={handleChangeStatus} />
        <ContentTopup status={+status} />
      </LayoutContainer>
    </>
  );
};

export default TopUp;
