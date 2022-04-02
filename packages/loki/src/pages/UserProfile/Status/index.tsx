import { Status as StatusUser } from '@greyhole/myid/myid_pb';
import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { t } from 'i18next';
import { useMemo } from 'react';

type ColorAndType = {
  color: string;
  type: string;
};

const getColorAndType = (statusType: StatusUser): ColorAndType => {
  let color = '';
  let type = '';

  switch (statusType) {
    case StatusUser.ACTIVE:
      color = '#30CB00';
      type = 'Active';
      break;

    case StatusUser.INACTIVE:
      color = '#FFB41F';
      type = 'Inactive';
      break;

    case StatusUser.LOCKED:
      color = '#F53131';
      type = 'Locked';
      break;

    case StatusUser.UNSPECIFIED:
      color = '#67677A';
      type = 'Unspecified';
      break;

    default:
      break;
  }

  return { color, type };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      whiteSpace: 'nowrap',
    },
    dot: {
      marginRight: theme.spacing(1),
      fontSize: 20,
    },
  }),
);

interface Props {
  status: StatusUser;
}

const Status = ({ status }: Props) => {
  const classes = useStyles();

  const { color, type } = useMemo(() => getColorAndType(status), [status]);

  return (
    <div className={classes.root}>
      <Box component="span" color={color} className={classes.dot}>
        ●
      </Box>
      <Typography component="span" variant={TypoVariants.body1} weight={TypoWeights.bold}>
        {t(type)}
      </Typography>
    </div>
  );
};

export default Status;
