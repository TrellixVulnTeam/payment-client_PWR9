import React from 'react';
import { Box, Grid } from '@material-ui/core';
import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

type Props = {
  title: React.ReactNode | string;
  value: React.ReactNode | string;
  background?: PaperBackgrounds;
};

const StatisticBox = ({ title, value, ...restProps }: Props) => {
  return (
    <>
      <Paper radius={PaperRadius.bold} {...restProps}>
        <Box p={3}>
          <Grid container spacing={1} direction="column">
            <Grid item>
              {React.isValidElement(title) ? (
                title
              ) : (
                <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
                  {title}
                </Typography>
              )}
            </Grid>
            <Grid item>
              {React.isValidElement(value) ? (
                value
              ) : (
                <Typography variant={TypoVariants.head1} weight={TypoWeights.bold} type={TypoTypes.secondary}>
                  {value}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default React.memo(StatisticBox);
