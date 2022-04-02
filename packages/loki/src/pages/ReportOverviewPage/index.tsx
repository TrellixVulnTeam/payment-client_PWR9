import { Box, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { StatusEnum } from 'redux/constant';
import { Helmet } from 'react-helmet-async';
import { getListMerchantsThunk } from 'redux/features/merchants/thunks';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectMerchant } from 'redux/features/merchants/slice';
import {
  resetReport,
  selectProfitRate,
  selectTopTellerRevenueList,
  selectTotalProfit,
  selectTotalRevenue,
} from 'redux/features/report/slice';
import {
  getIncomeStatementThunk,
  getPaymentTodayThunk,
  getProfitRateThunk,
  getAllocationTopUpRateThunk,
  getAllocationWithdrawRateThunk,
  getTopPaymentMethodThunk,
  getTopTellerThunk,
} from 'redux/features/report/thunks';

import AllowedTo from 'components/AllowedTo';
import FilterBar from 'components/FilterBar';
import DateRange from 'components/DateRange';
import Option from 'components/StyleGuide/Option';
import DropdownList from 'components/StyleGuide/DropdownList';
import LayoutContainer from 'components/Layout/LayoutContainer';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { Button } from 'components/StyleGuide/Button';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';

import useAuth from 'hooks/useAuth';
import useUsersMap from 'hooks/useUsersMap';
import { formatCurrency, APP_NAME } from 'utils/common';
import { formatTimeStampToSeconds, getCurrentTimeZone } from 'utils/date';
import { PerformPermission } from 'configs/routes/permission';
import { UrlParamsProvider } from 'context/url_params_context/url_params_context';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';

import TopTeller from './components/TopTeller';
import StatisticBox from './components/StatisticBox';
import PaymentToday from './components/PaymentToday';
import IncomeStatement from './components/IncomeStatement';
import TopPaymentMethod from './components/TopPaymentMethod';
import AllocationRateTopup from './components/AllocationRateTopup';
import AllocationRateWithdraw from './components/AllocationRateWithdraw';

import styles from './styles.module.scss';
import { iToast } from '@ilt-core/toast';
import { GetReportRequest } from '@mcuc/stark/howard_pb';

const ReportOverviewPage = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { userPermissions } = useAuth();

  const merchants = useAppSelector(selectMerchant);
  const totalRevenue = useAppSelector(selectTotalRevenue);
  const totalProfit = useAppSelector(selectTotalProfit);
  const profitRate = useAppSelector(selectProfitRate);
  const topTellerRevenueList = useAppSelector(selectTopTellerRevenueList);

  const topTellerRevenueIds = useMemo(
    () => topTellerRevenueList.topTellerRevenueList.map((item) => Number(item.userId)),
    [topTellerRevenueList],
  );

  useUsersMap(topTellerRevenueIds);

  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const { startDate, endDate, merchant } = urlParams;

  const [statusLoading, setStatusLoading] = useState(StatusEnum.IDLE);

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/report/overview',
        label: t('Report'),
      },
      {
        to: '/report/overview',
        label: t('Overview'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, t]);

  useEffect(() => {
    dispatch(
      getListMerchantsThunk({
        page: 1,
        size: 50,
        keyword: '',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    // Reset when leave page
    return () => {
      dispatch(resetReport());
    };
  }, [dispatch]);

  const handleSelectMerchant = useCallback(
    (value) => {
      setUrlParams({ merchant: value });
    },
    [setUrlParams],
  );

  const handleApply = useCallback(async () => {
    if (merchant && startDate && endDate) {
      setStatusLoading(StatusEnum.LOADING);

      const {
        getIncomeStatement,
        getPaymentToday,
        getProfitRate,
        getAllocationTopUpRate,
        getAllocationWithdrawRate,
        getTopPaymentMethod,
        getTopTeller,
      } = PerformPermission.reportOverview;

      const promises = [];

      const payload: GetReportRequest.AsObject = {
        merchantId: +merchant,
        fromDate: { nanos: 0, seconds: formatTimeStampToSeconds(startDate) },
        toDate: { nanos: 0, seconds: formatTimeStampToSeconds(endDate) },
        timeZone: getCurrentTimeZone(),
      };

      if (isLegalPermission(getIncomeStatement, userPermissions)) {
        promises.push(dispatch(getIncomeStatementThunk(payload)));
      }

      if (isLegalPermission(getPaymentToday, userPermissions)) {
        promises.push(dispatch(getPaymentTodayThunk(payload)));
      }

      if (isLegalPermission(getProfitRate, userPermissions)) {
        promises.push(dispatch(getProfitRateThunk(payload)));
      }

      if (isLegalPermission(getAllocationTopUpRate, userPermissions)) {
        promises.push(dispatch(getAllocationTopUpRateThunk(payload)));
      }

      if (isLegalPermission(getAllocationWithdrawRate, userPermissions)) {
        promises.push(dispatch(getAllocationWithdrawRateThunk(payload)));
      }

      if (isLegalPermission(getTopPaymentMethod, userPermissions)) {
        promises.push(dispatch(getTopPaymentMethodThunk(payload)));
      }

      if (isLegalPermission(getTopTeller, userPermissions)) {
        promises.push(dispatch(getTopTellerThunk(payload)));
      }

      try {
        await Promise.all(promises);
        setStatusLoading(StatusEnum.SUCCEEDED);
      } catch (error) {
        iToast.error({
          title: t('Error'),
          msg: t('Something went wrong!'),
        });
        setStatusLoading(StatusEnum.IDLE);
      }
    }
  }, [t, dispatch, endDate, startDate, merchant, userPermissions]);

  const handleClearFilter = () => {
    clearUrlParams();
    setStatusLoading(StatusEnum.IDLE);
  };

  const isApply = merchant && startDate && endDate;

  return (
    <>
      <Helmet>
        <title>
          {t('Report overview')} - {APP_NAME}
        </title>
      </Helmet>
      <UrlParamsProvider>
        <LayoutContainer
          header={
            <Box display="flex" flexDirection="column" mb={1}>
              <Typography variant={TypoVariants.head1} weight={TypoWeights.bold}>
                {t('Report overview')}
              </Typography>
              <Box mt={1}>
                <Typography variant={TypoVariants.body1} weight={TypoWeights.medium} type={TypoTypes.titleSub}>
                  {t('Please insert the conditions below to view the report')}
                </Typography>
              </Box>
            </Box>
          }
          maxWidth={false}
        >
          <FilterBar
            spacing={4}
            showReset={!!isApply}
            onClear={handleClearFilter}
            list={[
              {
                width: { xs: 'auto' },
                component: (
                  <DropdownList
                    variant={SelectVariants.selected}
                    value={+merchant || undefined}
                    onChange={handleSelectMerchant}
                    className={styles['merchantList']}
                    placeholder={t('Merchant')}
                    display={(child) => {
                      const innerChild = child.props?.children;
                      return (
                        <Typography type={TypoTypes.primary} variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {t('Merchant')}:{' '}
                          <Typography type={TypoTypes.primary} variant={TypoVariants.body1} component="span">
                            {innerChild || t('Selected')}
                          </Typography>
                        </Typography>
                      );
                    }}
                  >
                    {merchants.map((merchant) => (
                      <Option key={merchant.id} value={merchant.id}>
                        {merchant.name}
                      </Option>
                    ))}
                  </DropdownList>
                ),
              },
              {
                width: { xs: 'auto' },
                component: <DateRange />,
              },
              {
                width: { xs: 'auto' },
                component: (
                  <Button onClick={handleApply} disabled={!isApply} loading={statusLoading === StatusEnum.LOADING}>
                    <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                      {t('Apply')}
                    </Typography>
                  </Button>
                ),
              },
            ]}
          />
          <Box mt={3}>
            <Grid container spacing={3} direction="column">
              {statusLoading === StatusEnum.SUCCEEDED && (
                <>
                  <AllowedTo
                    perform={[
                      PerformPermission.reportOverview.getIncomeStatement,
                      PerformPermission.reportOverview.getPaymentToday,
                    ]}
                    renderYes={() => (
                      <Grid item container spacing={3} alignItems="stretch">
                        <Grid item sm={12} lg={7}>
                          <IncomeStatement />
                        </Grid>
                        <Grid item sm={12} lg={5}>
                          <PaymentToday />
                        </Grid>
                      </Grid>
                    )}
                    renderNo={() => (
                      <Grid item container spacing={3} alignItems="stretch">
                        <AllowedTo perform={PerformPermission.reportOverview.getIncomeStatement}>
                          <Grid item sm={12}>
                            <IncomeStatement />
                          </Grid>
                        </AllowedTo>
                        <AllowedTo perform={PerformPermission.reportOverview.getPaymentToday}>
                          <Grid item sm={12}>
                            <PaymentToday />
                          </Grid>
                        </AllowedTo>
                      </Grid>
                    )}
                  />

                  <AllowedTo
                    perform={PerformPermission.reportOverview.getProfitRate}
                    watch={[profitRate, totalRevenue, totalProfit]}
                  >
                    <Grid item container spacing={3}>
                      <Grid item sm={12} md={4}>
                        <StatisticBox title={t('Total Revenue')} value={`${formatCurrency(totalRevenue)} VND`} />
                      </Grid>
                      <Grid item sm={12} md={4}>
                        <StatisticBox title={t('Total profit')} value={`${formatCurrency(totalProfit)} VND`} />
                      </Grid>
                      <Grid item sm={12} md={4}>
                        <StatisticBox title={t('Profit rate')} value={`${formatCurrency(profitRate)} %`} />
                      </Grid>
                    </Grid>
                  </AllowedTo>

                  <AllowedTo
                    perform={[
                      PerformPermission.reportOverview.getAllocationTopUpRate,
                      PerformPermission.reportOverview.getAllocationWithdrawRate,
                    ]}
                    renderYes={() => (
                      <Grid item container spacing={3}>
                        <Grid item sm={12} lg={6}>
                          <AllocationRateTopup />
                        </Grid>
                        <Grid item sm={12} lg={6}>
                          <AllocationRateWithdraw />
                        </Grid>
                      </Grid>
                    )}
                    renderNo={() => (
                      <Grid item container spacing={3}>
                        <AllowedTo perform={PerformPermission.reportOverview.getAllocationTopUpRate}>
                          <Grid item xs={12}>
                            <AllocationRateTopup />
                          </Grid>
                        </AllowedTo>
                        <AllowedTo perform={PerformPermission.reportOverview.getAllocationWithdrawRate}>
                          <Grid item xs={12}>
                            <AllocationRateWithdraw />
                          </Grid>
                        </AllowedTo>
                      </Grid>
                    )}
                  />

                  <Grid item container spacing={3}>
                    <AllowedTo perform={PerformPermission.reportOverview.getTopPaymentMethod}>
                      <Grid item xs={12}>
                        <TopPaymentMethod />
                      </Grid>
                    </AllowedTo>
                    <AllowedTo perform={PerformPermission.reportOverview.getTopTeller}>
                      <Grid item xs={12}>
                        <TopTeller />
                      </Grid>
                    </AllowedTo>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </LayoutContainer>
      </UrlParamsProvider>
    </>
  );
};

export default ReportOverviewPage;
