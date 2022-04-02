import React, { useEffect, useMemo, useState } from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import FormTabs from 'components/Tabs';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { useAppDispatch } from 'redux/store';
import { getSellReportByPaymentMethodThunk } from 'redux/features/saleReport/thunks';
import { APP_NAME } from 'utils/common';
import { formatTimeStampToSeconds, getRangeByPeriod } from 'utils/date';
import { REPORT_SALE, REPORT_SALE_METHOD } from 'configs/routes/path';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import useAuth from 'hooks/useAuth';

import HeaderActions from './components/Header';
import Content from './Content';
import { Tab } from './types';
import { PeriodType } from 'context/url_params_context/resolve_url_params';

const ReportSaleMethodPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userPermissions } = useAuth();

  const [urlParams, setUrlParams] = useUpdateUrlParams();
  const { tab: tabParam = Tab.VND, period = PeriodType.Last7Days } = urlParams;

  const [tab, setTab] = useState(+tabParam);

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: REPORT_SALE,
        label: t('Report'),
      },
      {
        to: REPORT_SALE,
        label: t('Sale Report'),
      },
      {
        to: REPORT_SALE_METHOD,
        label: t('Method'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const { start, end } = getRangeByPeriod(period);
    dispatch(
      getSellReportByPaymentMethodThunk({
        currency: +tabParam,
        fromDate: start
          ? {
              seconds: formatTimeStampToSeconds(start),
              nanos: 0,
            }
          : undefined,
        toDate: end
          ? {
              seconds: formatTimeStampToSeconds(end),
              nanos: 0,
            }
          : undefined,
      }),
    );
  }, [dispatch, tabParam, period]);

  const tabList = useMemo(
    () =>
      [
        {
          label: t('VND'),
          value: Tab.VND,
          panel: null,
          hidden: !isLegalPermission([], userPermissions),
        },
        {
          label: t('Crypto'),
          value: Tab.USDT,
          panel: null,
          hidden: !isLegalPermission([], userPermissions),
        },
      ].filter((item) => !item.hidden),
    [userPermissions],
  );

  const handleChange = (event: React.ChangeEvent<{}>, newTab: string) => {
    setUrlParams({
      tab: newTab,
    });
    setTab(+newTab);
  };

  return (
    <>
      <Helmet>
        <title>
          {t('Method Report')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer maxWidth={false} header={<HeaderActions />}>
        <FormTabs tabList={tabList} currentTab={tab} onChange={handleChange} />
        <Content />
      </LayoutContainer>
    </>
  );
};

export default ReportSaleMethodPage;
