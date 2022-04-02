import { Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { formatPriceVND } from 'utils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    statistic: {
      border: '1px solid #ddd',
      padding: theme.spacing(2),
    },
    value: {
      fontWeight: 'bold',
      padding: '8px 0',
    },
    subtitle: {
      padding: '8px 0',
    },
  }),
);

type Props = {
  title: string;
  subtitle: string;
  value: number | string;
};

const Statistic: React.FunctionComponent<Props> = ({
  title,
  subtitle,
  value,
}) => {
  const classes = useStyles();
  return (
    <Box className={classes.statistic}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h5" className={classes.value}>
        {formatPriceVND(value)}
      </Typography>
      <Typography className={classes.subtitle}>{subtitle}</Typography>
    </Box>
  );
};

export default Statistic;
