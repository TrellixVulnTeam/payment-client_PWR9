import { Grid } from '@material-ui/core';
import { PaymentType } from '@mcuc/stark/stark_pb';
import _isEmpty from 'lodash-es/isEmpty';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { getListMerchantsThunk } from 'redux/features/merchants/thunks';

import AllowedTo from 'components/AllowedTo';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { useBreadcrumbs, IBreadcrumb } from 'components/AlopayBreadcrumbs/useBreadcrumbs';

import { APP_NAME } from 'utils/common';
import { PerformPermission } from 'configs/routes/permission';
import { UrlParamsProvider } from 'context/url_params_context/url_params_context';

import { useGetStatisticsFetcher } from './hooks/useGetStatisticsFetcher';
import { useProcessingPerformanceFetcher } from './hooks/useGetProcessingPerformanceFetcher';
// import ReportList from './ReportList';
import StatisticPayment from './StatisticPayment';
import StatisticTotalAmount from './StatisticTotalAmount';
import StatisticProcessPerformance from './StatisticProcessingPerformance';
import { DEFAULT_PAGE_SIZE } from './const';

const StatisticsPage = () => {
  const { t } = useTranslation();

  const merchants = useSelector(selectDisplayMerchants);
  const dispatch = useDispatch();
  const { setBreadcrumbs } = useBreadcrumbs();

  useGetStatisticsFetcher(PaymentType.TOPUP);
  useGetStatisticsFetcher(PaymentType.WITHDRAW);

  useProcessingPerformanceFetcher();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/statistics',
        label: t('Statistics'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [t, setBreadcrumbs]);

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
        <title>
          {t('Statistics')} - {APP_NAME}
        </title>
      </Helmet>
      <UrlParamsProvider>
        <LayoutContainer header={t('Statistics')} maxWidth={false}>
          <Grid container spacing={3} direction="column">
            <AllowedTo perform={PerformPermission.statistics.getStatistic}>
              <Grid item>
                <StatisticPayment />
              </Grid>
            </AllowedTo>
            {!_isEmpty(merchants) && (
              <Grid item>
                <AllowedTo
                  perform={[
                    PerformPermission.statistics.getProcessingPerformance,
                    PerformPermission.statistics.getTotalAmount,
                  ]}
                  renderYes={() => (
                    <Grid container spacing={3}>
                      <Grid item md={12} lg={5}>
                        <StatisticProcessPerformance />
                      </Grid>
                      <Grid item md={12} lg={7}>
                        <StatisticTotalAmount />
                      </Grid>
                    </Grid>
                  )}
                  renderNo={() => (
                    <Grid container spacing={3}>
                      <AllowedTo perform={PerformPermission.statistics.getProcessingPerformance}>
                        <Grid item xs={12}>
                          <StatisticProcessPerformance />
                        </Grid>
                      </AllowedTo>
                      <AllowedTo perform={PerformPermission.statistics.getTotalAmount}>
                        <Grid item xs={12}>
                          <StatisticTotalAmount />
                        </Grid>
                      </AllowedTo>
                    </Grid>
                  )}
                />
              </Grid>
            )}
            {/* <Grid item>
              <ReportList />
            </Grid> */}
          </Grid>
        </LayoutContainer>
      </UrlParamsProvider>
    </>
  );
};

export default StatisticsPage;
