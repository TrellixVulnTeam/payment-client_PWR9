import { Box, Grid } from '@material-ui/core';
import SplineChart from 'components/Charts/SplineChart';
import Typography, { TypoWeights } from 'components/StyleGuide/Typography';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { t } from 'i18next';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { selectTotalAmountData } from 'redux/features/statistics/slice';

interface Props {}

const TotalAmountChart = (props: Props) => {
  const [urlParams] = useUpdateUrlParams();
  let { merchant_ids: merchantParams } = urlParams;

  const totalAmount = useSelector(selectTotalAmountData);
  const merchants = useSelector(selectDisplayMerchants);
  const categories = _get(totalAmount, 'categories', []);
  const series = _get(totalAmount, 'series', []);

  const formatSeriesData = useMemo(
    () =>
      series.filter(Boolean).map((x) => ({
        name: x.id.toString(),
        label: merchants.find((m) => m.id === x.id)?.name,
        data: x.data,
      })),
    [merchants, series],
  );

  const formatCategoriesData = useMemo(() => categories.map((x) => x.seconds), [categories]);

  if (_isEmpty(merchantParams)) {
    return (
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs="auto">
          <Box pt={5}>
            <Typography weight={TypoWeights.medium}>{t('No data')}</Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }

  return <SplineChart categories={formatCategoriesData} series={formatSeriesData} />;
};

export default React.memo(TotalAmountChart);
