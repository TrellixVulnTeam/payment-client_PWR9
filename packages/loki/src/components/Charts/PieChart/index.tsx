import React from 'react';
import { Grid } from '@material-ui/core';
import Typography, { TypoWeights } from 'components/StyleGuide/Typography';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartVariablePie from 'highcharts/modules/variable-pie';
import { options } from './options';
import styles from './styles.module.scss';
import { getRandomColor } from 'utils/common';

export interface IPieChartData {
  name: string;
  y: number;
  value: any;
}

interface Props {
  data: IPieChartData[];
  type: string;
}

const defaultProps = {
  data: [],
};

const DEFAULT_COLORS = ['#5D1BE0', '#29E08B', '#FFD52F', '#F53131'];

HighchartVariablePie(Highcharts);

const PieChart = (props: Props) => {
  const { data, type } = { ...defaultProps, ...props };

  const colors = data.map((_, index) => DEFAULT_COLORS[index] || getRandomColor());

  return (
    <Grid container spacing={0} justifyContent="space-between" alignItems="center">
      <Grid item xs={12} lg={4}>
        <Grid container direction="column" spacing={3}>
          {data.map((item, index) => (
            <Grid item key={index}>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <div className={styles['line']} style={{ background: colors[index] }} />
                </Grid>
                <Grid item>
                  <Typography weight={TypoWeights.bold}>{item.name}</Typography>
                </Grid>
                <Grid item>
                  <Typography weight={TypoWeights.bold} style={{ color: colors[index] }}>
                    ({(item.y || 0).toFixed()}%)
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12} lg={8}>
        <HighchartsReact highcharts={Highcharts} options={options(data, colors, type)} allowChartUpdate />
      </Grid>
    </Grid>
  );
};

export default PieChart;
