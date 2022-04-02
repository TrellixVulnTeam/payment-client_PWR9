import { createStyles, makeStyles, Theme } from '@material-ui/core';

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

const Number = ({ value, align = 'left' }: Props) => {
  const classes = useStyles();

  return (
    <div
      className={align === 'left' ? classes.left : classes.right}
      style={{ fontFeatureSettings: `"tnum"` }}
    >
      {value}
    </div>
  );
};

export default Number;
