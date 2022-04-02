import { Box, Grid } from '@material-ui/core';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { t } from 'i18next';
import _cloneDeep from 'lodash-es/cloneDeep';
import _get from 'lodash-es/get';
import React, { useCallback } from 'react';
import ReactDomServer from 'react-dom/server';

import Paper from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import { formatCurrency, getRandomColor } from 'utils/common';
import { BASE_OPTIONS_SPLINE_CHARTS, TOOLTIP_OPTIONS } from './const';
import styles from './styles.module.scss';
import { formatDate, formatWithSchema } from 'utils/date';

type Props = {
  categories: (string | number)[];
  series: { name: string; label: string; data: number[] }[];
  chartOptions?: any;
};

Highcharts.setOptions({
  ...BASE_OPTIONS_SPLINE_CHARTS,
});

const DEFAULT_COLORS = ['#5D1BE0', '#29E08B', '#FFD52F', '#F53131'];

const SplineChart = ({ categories: seconds, series: dataOfIds, chartOptions = {} }: Props) => {
  // add deep clone to prevent crashed app on updated data
  const categories = _cloneDeep(seconds);
  const series = _cloneDeep(dataOfIds);

  const seriesLabel = series.map((item) => item.label);
  const seriesColors = seriesLabel.map((_, index) => DEFAULT_COLORS[index] || getRandomColor());

  const getTickInterval = useCallback(() => {
    const total = seconds.length;
    if (total > 7) {
      return 7;
    }
    return 1;
  }, [seconds.length]);

  const options = {
    xAxis: {
      tickInterval: getTickInterval(),
      labels: {
        formatter: function () {
          const index = _get(this, 'value', 0);
          const date = _get(categories, `[${index}]`) * 1000;
          const dateDisplay = formatDate(date);
          return ReactDomServer.renderToStaticMarkup(
            <Typography
              className={styles['x-axis-text']}
              variant={TypoVariants.caption}
              type={TypoTypes.titleSub}
              component="span"
            >
              {dateDisplay}
            </Typography>,
          );
        },
      },
    },
    yAxis: {
      title: {
        text: '',
      },
      labels: {
        formatter: function () {
          return ReactDomServer.renderToStaticMarkup(
            <Grid container direction="column" spacing={1}>
              {(this.isFirst || this.isLast) && (
                <Grid item>
                  <Typography
                    className={styles['x-axis-text']}
                    variant={TypoVariants.caption}
                    type={TypoTypes.titleSub}
                    component="span"
                  >
                    ({CURRENCY_TYPE.VND})
                  </Typography>
                </Grid>
              )}
              <Grid item>
                <Typography
                  className={styles['x-axis-text']}
                  variant={TypoVariants.caption}
                  type={TypoTypes.titleSub}
                  component="span"
                >
                  {' '}
                  {formatCurrency(this.value)}
                </Typography>
              </Grid>
            </Grid>,
          );
        },
      },
      useHTML: true,
    },
    tooltip: {
      ...TOOLTIP_OPTIONS,
      formatter: function () {
        const date = _get(categories, `[${this.x}]`) * 1000;
        const dateDisplay = formatWithSchema(date, 'dd MMMM yyyy');
        return ReactDomServer.renderToStaticMarkup(
          <Paper className={styles['tooltip-container']}>
            <Box py={1} px={2}>
              <Grid container spacing={1} direction="column">
                <Grid item>
                  <Typography type={TypoTypes.invert} variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {dateDisplay}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography type={TypoTypes.invert}>
                    {t('Total amount')} ({CURRENCY_TYPE.VND})
                  </Typography>
                </Grid>
                <Grid item>
                  {this.points?.map((point, index) => (
                    <Grid container spacing={1} alignItems="center" wrap="nowrap">
                      <Grid item>
                        <div className={styles['line']} style={{ background: _get(seriesColors, `[${index}]`) }} />
                      </Grid>
                      <Grid item>
                        <Typography type={TypoTypes.invert} variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {seriesLabel[index]}: {formatCurrency(point.y)}
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Box>
          </Paper>,
        );
      },
    },
    colors: seriesColors,
    series,
    ...chartOptions,
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Grid container spacing={4}>
          {seriesLabel.map((label, index) => (
            <Grid item key={index}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <div className={styles['line']} style={{ background: seriesColors[index] }} />
                </Grid>
                <Grid item>
                  <Typography weight={TypoWeights.bold}>{label}</Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Grid>
    </Grid>
  );
};

export default React.memo(SplineChart);
