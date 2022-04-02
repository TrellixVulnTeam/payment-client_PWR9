import React from 'react';
import { t } from 'i18next';
import { Grid } from '@material-ui/core';
import Typography, { TypoWeights } from 'components/StyleGuide/Typography';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartVariablePie from 'highcharts/modules/variable-pie';
import { getRandomColor } from 'utils/common';
import { options } from './options';
import styles from './styles.module.scss';

export interface BarChartProps {
  categories: (string | number)[];
  series: { name: string; data: number[] }[];
  currencyType: string;
}

const defaultProps = {
  categories: [],
  series: [],
};

const DEFAULT_COLORS = ['#5D1BE0', '#29E08B', '#FFD52F', '#F53131'];

HighchartVariablePie(Highcharts);

const BarChart = (props: BarChartProps) => {
  const { categories, series, currencyType } = { ...defaultProps, ...props };

  const seriesLabel = series.map((item) => item.name);
  const seriesColors = Array(10)
    .fill(0)
    .map((_, index) => DEFAULT_COLORS[index] || getRandomColor());

  return (
    <Grid container spacing={4} justifyContent="space-between" alignItems="center">
      <Grid item>
        <Grid container spacing={4}>
          {seriesLabel.map((label, index) => (
            <Grid item key={index}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <div className={styles['line']} style={{ background: DEFAULT_COLORS[index] }} />
                </Grid>
                <Grid item>
                  <Typography weight={TypoWeights.bold}>{t(label)}</Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options({
            series,
            categories,
            colors: seriesColors,
            currencyType,
          })}
          allowChartUpdate
        />
      </Grid>
    </Grid>
  );
};

export default BarChart;
