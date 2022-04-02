import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import ImagePaper from 'assets/images/alert_error.png';
import React from 'react';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

const useStyles = makeStyles<Theme>((theme) => ({
  image: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(3),
  },
  button: {
    height: '56px',
    marginTop: theme.spacing(3),
  },
  text: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
}));

const AlertError = () => {
  const classes = useStyles();
  return (
    <div>
      <Box className={classes.image}>
        <img alt="paper" src={ImagePaper} />
      </Box>
      <Box mt={1}>
        <Typography variant={TypoVariants.body1} type={TypoTypes.sub} weight={TypoWeights.light}>
          You can't create a new user because you already lost your internet when the system was conducting creation.
          Please reconnect and try again.
        </Typography>
      </Box>
    </div>
  );
};

export default AlertError;
