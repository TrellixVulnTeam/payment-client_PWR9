import { Status as StatusAccount } from '@greyhole/myid/myid_pb';
import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { t } from 'i18next';
import { useMemo } from 'react';
import { getColorTypeStatusAccount } from 'utils/constant/user';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      whiteSpace: 'nowrap',
    },
    dot: {
      marginRight: theme.spacing(1),
    },
  }),
);

interface Props {
  status: StatusAccount;
}

const Status = ({ status }: Props) => {
  const classes = useStyles();

  const { color, type } = useMemo(() => getColorTypeStatusAccount(status), [status]);

  return (
    <div className={classes.root}>
      <Box component="span" color={color} className={classes.dot}>
        ●
      </Box>
      <Typography component="span" variant={TypoVariants.body2} weight={TypoWeights.bold} type={TypoTypes.sub}>
        {t(type)}
      </Typography>
    </div>
  );
};

export default Status;
