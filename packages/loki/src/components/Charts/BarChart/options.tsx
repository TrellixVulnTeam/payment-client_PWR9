import { t } from 'i18next';
import { Box, Grid } from '@material-ui/core';
import ReactDomServer from 'react-dom/server';
import Paper from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { formatCurrency } from 'utils/common';
import styles from './styles.module.scss';

type BarChartProps = {
  series: { name: string; data: number[] }[];
  categories: (string | number)[];
  colors: string[];
  currencyType: string;
};

export const options = ({ series = [], categories = [], colors = [], currencyType }: BarChartProps) => ({
  credits: {
    enabled: false,
  },
  chart: {
    type: 'column',
  },
  title: {
    style: { display: 'none' },
  },
  yAxis: {
    min: 0,
    title: {
      text: '',
    },
    useHTML: true,
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
                  ({currencyType})
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

    plotOptions: {
      column: {
        pointPadding: 0,
        borderWidth: 0,
      },
    },

    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
  },
  colors,
  series,
  xAxis: {
    categories,
    crosshair: true,
  },
  tooltip: {
    headerFormat: '',
    borderRadius: 8,
    borderWidth: 0,
    padding: 0,
    style: {
      padding: 0,
    },
    shared: true,
    shadow: false,
    useHTML: true,
    formatter: function () {
      return ReactDomServer.renderToStaticMarkup(
        <Paper className={styles['tooltip-container']}>
          <Box py={1} px={2}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography type={TypoTypes.invert} variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {this.x}
                </Typography>
              </Grid>
              <Grid item>
                <Typography type={TypoTypes.invert} variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {`${t('Total amount')} (${currencyType})`}
                </Typography>
              </Grid>
              {series.map((item, index) => (
                <Grid item key={index}>
                  <Grid container spacing={1} alignItems="center" wrap="nowrap">
                    <Grid item>
                      <div className={styles['line']} style={{ background: colors[index] }} />
                    </Grid>
                    <Grid item>
                      <Typography weight={TypoWeights.bold} type={TypoTypes.invert}>
                        {item.name}: {formatCurrency(this.points[index]?.y)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>,
      );
    },
  },
});
