import { Status } from '@mcuc/stark/stark_pb';
import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch } from 'redux/store';
import { getListMerchantsThunk } from 'redux/features/merchants/thunks';

import FormTabs from 'components/Tabs';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { APP_NAME } from 'utils/common';

import ContentWithdraw from './Content';
import { t } from 'i18next';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, STATUS_FAILED } from './constants';

const WithdrawPage = () => {
  const dispatch = useAppDispatch();
  const { setBreadcrumbs } = useBreadcrumbs();

  const [currentParams, setUrlParams] = useUpdateUrlParams();
  const { status: statusParam = Status.CREATED } = currentParams;
  const [status, setStatus] = useState(+statusParam);

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/payment/withdraw',
        label: t('Payment'),
      },
      {
        to: '/payment/withdraw',
        label: t('Withdraw'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  const handleChangeStatus = (event: React.ChangeEvent<{}>, status: number) => {
    setUrlParams({
      status,
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    });
    setStatus(status);
  };

  useEffect(() => {
    dispatch(
      getListMerchantsThunk({
        page: 1,
        size: 50,
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
        label: t('Submitted'),
        value: Status.SUBMITTED,
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
        label: t('Canceled'),
        value: Status.CANCELED,
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
        <title>
          {t('Withdraw')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer header={t('Withdraw')} maxWidth={false}>
        <FormTabs currentTab={status} tabList={tabList} onChange={handleChangeStatus} />
        <ContentWithdraw status={+status} />
      </LayoutContainer>
    </>
  );
};

export default WithdrawPage;
