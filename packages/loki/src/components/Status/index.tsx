import React from 'react';
import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      whiteSpace: 'nowrap',
    },
    dot: {
      marginRight: theme.spacing(1),
      fontSize: 18,
    },
  }),
);

interface StatusProps {
  value: number | string;
  colorType: {
    color: string;
    type: string;
  };
}

const Status: React.FC<StatusProps> = ({ colorType }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box component="span" color={colorType.color} className={classes.dot}>
        ●
      </Box>
      <Typography component="span" variant={TypoVariants.body1} weight={TypoWeights.bold}>
        {colorType.type}
      </Typography>
    </div>
  );
};

export default Status;
