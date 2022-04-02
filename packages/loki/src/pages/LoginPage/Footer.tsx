import { Box, Link, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
  }),
);

export const Footer = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root} whiteSpace="nowrap">
      <Typography color="textSecondary">
        {'Copyright © '}
        <Link color="inherit" href="http://inspirelab.io/">
          <strong>Inspire Lab</strong>
        </Link>
        <span>{` ${new Date().getFullYear()}.`}&nbsp;</span>
      </Typography>
      <Typography color="textSecondary">All rights reserved.</Typography>
    </Box>
  );
};
