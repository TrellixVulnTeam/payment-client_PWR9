import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { formatCurrency } from 'utils/common';

interface Props {
  value: string;
  align?: 'left' | 'right';
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    left: {
      textAlign: 'left',
    },
    right: {
      textAlign: 'right',
    },
  }),
);

const Currency = ({ value, align = 'left' }: Props) => {
  const classes = useStyles();

  return (
    <div
      className={align === 'left' ? classes.left : classes.right}
      style={{ fontFeatureSettings: `"tnum"` }}
    >
      {formatCurrency(value)}
    </div>
  );
};

export default Currency;
