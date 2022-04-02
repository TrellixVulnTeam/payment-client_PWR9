import { Box, Grid } from '@material-ui/core';
import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { useCountUp } from 'use-count-up';

export interface IStatisticBox {
  title: string;
  unit: string;
  value: number;
}

interface Props {
  data: IStatisticBox;
}

const StatisticBox = (props: Props) => {
  const { data } = { ...props };
  const { value } = useCountUp({
    isCounting: true,
    end: data.value,
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
        </Grid>
      </Box>
    </Paper>
  );
};

export default StatisticBox;
