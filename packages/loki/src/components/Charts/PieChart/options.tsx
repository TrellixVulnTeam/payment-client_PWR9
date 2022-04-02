import { t } from 'i18next';
import { Box, Grid } from '@material-ui/core';
import ReactDomServer from 'react-dom/server';
import Paper from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { formatCurrency } from 'utils/common';
import styles from './styles.module.scss';

export const theme = {
  chartConfig: {
    chart: {
      type: 'line',
    },
    title: {
      text: '',
    },
    xAxis: {
      gridLineWidth: 0,
      labels: {},
      title: {
        style: {},
      },
    },
    yAxis: {
      labels: {
        style: {},
      },
      title: {
        style: {},
      },
    },
    credits: {
      enabled: false,
    },
    legend: {
      layout: 'horizontal',
      align: 'right',
      verticalAlign: 'top',
      symbolHeight: 10,
      symbolWidth: 10,
      symbolRadius: 12,
      itemHoverStyle: {},
    },
    plotOptions: {
      series: {
        marker: {
          symbol: 'circle',
          lineWidth: 3,
          radius: 5,
        },
        animation: {
          duration: 1000,
        },
      },
      line: {
        lineWidth: 1,
      },
      column: {
        borderColor: '#FFFFFF60',
      },
      lollipop: {
        connectorWidth: 10,
        marker: {
          lineColor: '#FFFFFFA0',
        },
      },
      dumbbell: {
        connectorWidth: 7,
        marker: {
          lineColor: '#FFFFFFA0',
        },
      },
      bar: {
        borderColor: '#FFFFFF60',
      },
      scatter: {
        marker: {
          symbol: 'circle',
          radius: 5,
          lineWidth: 0,
          lineColor: '#FFFFFFA0',
          states: {
            hover: {
              enabled: true,
            },
          },
        },
        states: {
          hover: {
            marker: {
              enabled: false,
            },
          },
        },
        tooltip: {
          pointFormat: '<span>{series.name}</span>: <b>{point.x}, {point.y}</b>{point.change}<br/>',
        },
      },
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        borderColor: '#FFFFFF60',
      },
      variablepie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
        borderColor: '#FFFFFF60',
      },
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
        linecap: 'round',
        stickyTracking: false,
        rounded: true,
      },
    },
  },
};

export const options = (data = [], colors = [], type) => ({
  ...theme.chartConfig,
  title: {
    style: { display: 'none' },
  },
  subtitle: {
    text: '',
  },
  credits: {
    enabled: false,
  },
  tooltip: {
    borderRadius: 8,
    borderWidth: 0,
    shadow: false,
    padding: 0,
    style: {
      padding: 0,
    },
    headerFormat: '',
    useHTML: true,
    formatter: function () {
      return ReactDomServer.renderToStaticMarkup(
        <Paper className={styles['tooltip-container']}>
          <Box py={1} px={2}>
            <Grid container direction="column" spacing={1} alignItems="center">
              <Grid item>
                <Typography type={TypoTypes.invert} variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {t(`Total {{status}} orders`, {
                    status: t(this.key).toLowerCase(),
                  })}
                </Typography>
              </Grid>
              <Grid item>
                <Grid container spacing={1} alignItems="center" wrap="nowrap">
                  <Grid item xs="auto">
                    <div className={styles['line']} style={{ background: colors[this.colorIndex] }} />
                  </Grid>
                  <Grid item xs="auto">
                    <Typography type={TypoTypes.invert}>
                      {t('Total {{value}}', {
                        value: `${formatCurrency(data[this.colorIndex].value)}`,
                      })}{' '}
                      {t(type)}
                    </Typography>
                  </Grid>
                  <Grid item xs="auto">
                    <Typography weight={TypoWeights.bold} style={{ color: colors[this.colorIndex] }}>
                      ({(this.y || 0).toFixed()}%)
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Paper>,
      );
    },
  },
  accessibility: {
    point: {
      valueSuffix: '%',
    },
  },
  chart: {
    ...theme.chartConfig.chart,
    plotBackgroundColor: null,
    plotBorderWidth: 0,
    plotShadow: false,
    backgroundColor: 'transparent',
  },
  plotOptions: {
    pie: {
      allowPointSelect: false,
      colors: colors,
      cursor: 'pointer',
      dataLabels: {
        enabled: false,
      },
    },
  },
  legend: {
    layout: 'vertical',
    itemStyle: {},
    itemHoverStyle: {},
    symbolRadius: 0,
  },
  series: [
    {
      type: 'pie',
      name: 'name',
      innerSize: '40%',
      data,
    },
  ],
});
