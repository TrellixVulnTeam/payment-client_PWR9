import React, { useEffect, useMemo, useState } from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import LayoutContainer from 'components/Layout/LayoutContainer';
import HeaderActions from './components/Header';
import FormTabs from 'components/Tabs';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { REPORT_SALE, REPORT_SALE_TIME } from 'configs/routes/path';
import { formatTimeStampToSeconds, getCurrentTimeZone, getRangeByPeriod } from 'utils/date';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { useAppDispatch } from 'redux/store';
import { getSellReportByTimeRangeThunk } from 'redux/features/saleReport/thunks';
import useAuth from 'hooks/useAuth';
import { APP_NAME } from 'utils/common';
import Content from './Content';
import { Tab } from './types';
import { PeriodType } from 'context/url_params_context/resolve_url_params';

const ReportSaleTimePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { userPermissions } = useAuth();
  const { setBreadcrumbs } = useBreadcrumbs();
  const [urlParams, setUrlParams] = useUpdateUrlParams();

  const { tab: tabParam = Tab.VND, period = PeriodType.Last7Days } = urlParams;

  const [tab, setTab] = useState(+tabParam);

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
        to: REPORT_SALE_TIME,
        label: t('Time'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  useEffect(() => {
    const { start, end } = getRangeByPeriod(period);
    dispatch(
      getSellReportByTimeRangeThunk({
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
        timeZone: getCurrentTimeZone(),
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
          {t('Time Report')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer maxWidth={false} header={<HeaderActions />}>
        <FormTabs tabList={tabList} currentTab={tab} onChange={handleChange} />
        <Content />
      </LayoutContainer>
    </>
  );
};

export default ReportSaleTimePage;
