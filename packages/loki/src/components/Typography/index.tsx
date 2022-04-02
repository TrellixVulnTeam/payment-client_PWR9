import { Theme } from '@material-ui/core';
import MuiTypography from '@material-ui/core/Typography';
import { withStyles, createStyles } from '@material-ui/styles';

export const TypographyPurple = withStyles((theme: Theme) =>
  createStyles({
    root: {
      color: 'blue',
    },
  }),
)(MuiTypography);
