import { Box, Grid } from '@material-ui/core';
import React, { useEffect } from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';

import Icon from 'components/StyleGuide/Icon';
import HeaderActions from './components/Header';
import LayoutPaper from 'components/Layout/LayoutPaper';
import LayoutContainer from 'components/Layout/LayoutContainer';
import Typography, { TypoVariants } from 'components/StyleGuide/Typography';
import StaticBox from './components/StaticBox';
import { BookmarkPercent, CalendarTime, Merchant, PersonMoney } from 'assets/icons/ILT';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { REPORT_SALE_MERCHANT, REPORT_SALE_METHOD, REPORT_SALE_TELLER, REPORT_SALE_TIME } from 'configs/routes/path';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';
import { APP_NAME } from 'utils/common';
import AllowedTo from 'components/AllowedTo';
import { PerformPermission } from 'configs/routes/permission';

const ReportSale: React.FC = () => {
  const history = useHistory();

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/report/sale',
        label: t('Report'),
      },
      {
        to: '/report/sale',
        label: t('Sale Report'),
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  return (
    <>
      <Helmet>
        <title>
          {uppercaseFirstLetterAllWords(t('Sale Report'))} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer maxWidth={false} header={<HeaderActions />}>
        <LayoutPaper
          header={
            <Box>
              <Typography variant={TypoVariants.head2}>{uppercaseFirstLetterAllWords(t('Revenue report'))}</Typography>
              <Box mt={1}>
                <Typography variant={TypoVariants.body1}>{t('Track Income Revenue Based on')}</Typography>
              </Box>
            </Box>
          }
        >
          <Grid container spacing={2}>
            <AllowedTo perform={PerformPermission.saleReportTime.getSellReportByTimeRange}>
              <Grid item xs={12} sm={6} lg={3}>
                <StaticBox
                  label={t('Time')}
                  icon={<Icon width="72" height="72" color="#99ADFF" component={CalendarTime} />}
                  onClick={() => history.push(REPORT_SALE_TIME)}
                />
              </Grid>
            </AllowedTo>
            <AllowedTo perform={PerformPermission.saleReportMerchant.getSellReportByMerchant}>
              <Grid item xs={12} sm={6} lg={3}>
                <StaticBox
                  label={t('Merchant')}
                  icon={<Icon width="72" height="72" color="#99ADFF" component={Merchant} />}
                  onClick={() => history.push(REPORT_SALE_MERCHANT)}
                />
              </Grid>
            </AllowedTo>
            <AllowedTo perform={PerformPermission.saleReportMethod.getSellReportByPaymentMethod}>
              <Grid item xs={12} sm={6} lg={3}>
                <StaticBox
                  label={t('Method')}
                  icon={<Icon width="72" height="72" color="#99ADFF" component={BookmarkPercent} />}
                  onClick={() => history.push(REPORT_SALE_METHOD)}
                />
              </Grid>
            </AllowedTo>
            <AllowedTo perform={PerformPermission.saleReportTeller.getSellReportByTeller}>
              <Grid item xs={12} sm={6} lg={3}>
                <StaticBox
                  label={t('Teller')}
                  icon={<Icon width="72" height="72" color="#99ADFF" component={PersonMoney} />}
                  onClick={() => history.push(REPORT_SALE_TELLER)}
                />
              </Grid>
            </AllowedTo>
          </Grid>
        </LayoutPaper>
      </LayoutContainer>
    </>
  );
};

export default ReportSale;
