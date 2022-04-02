import { Box, Grid } from '@material-ui/core';
import ArrowDown from 'assets/icons/ILT/lib/ArrowDown';
import ArrowUp from 'assets/icons/ILT/lib/ArrowUp';
import cn from 'classnames';
import Icon from 'components/StyleGuide/Icon';
import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import React from 'react';
import { useCountUp } from 'use-count-up';
import styles from './styles.module.scss';

export interface IStatisticBox {
  title: string;
  unit: string;
  value: number;
  direction: string;
  percent: number;
  description: string;
}

interface Props {
  data: IStatisticBox;
}

const StatisticBox = (props: Props) => {
  const { data } = { ...props };

  const { value } = useCountUp({
    isCounting: true,
    end: data.value || 0,
    duration: 1,
    thousandsSeparator: '.',
  });

  return (
    <Paper radius={PaperRadius.bold} background={PaperBackgrounds.ghost}>
      <Box p={3}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Grid container justifyContent="space-between">
              <Grid item xs="auto">
                <Typography variant={TypoVariants.head4} weight={TypoWeights.bold}>
                  {data.title}
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <Typography variant={TypoVariants.body1} weight={TypoWeights.light} type={TypoTypes.titleSub}>
                  ({data.unit})
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Typography variant={TypoVariants.head1} weight={TypoWeights.bold} type={TypoTypes.secondary}>
              {value}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item xs="auto">
                <Icon
                  className={cn(styles['icon'], styles[`direction-${data.direction}`])}
                  component={data.direction === 'up' ? ArrowUp : ArrowDown}
                />
              </Grid>
              <Grid item xs="auto">
                <Typography
                  variant={TypoVariants.body2}
                  weight={TypoWeights.bold}
                  type={data.direction === 'up' ? TypoTypes.success : TypoTypes.error}
                >
                  {isFinite(data?.percent) ? Math.round(data?.percent * 100) / 100 : 0}%
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <Typography variant={TypoVariants.body2} weight={TypoWeights.light} type={TypoTypes.sub}>
                  {data.description}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default StatisticBox;
