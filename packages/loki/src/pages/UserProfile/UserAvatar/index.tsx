import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { CircularProgress } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useImageLoaded, { ImageStatus } from 'hooks/useImageLoaded';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: '120px',
      height: '120px',
      border: `3px solid ${theme.palette.primary.main}`,
    },
  }),
);

type Props = {
  src: string;
};

const UserAvatar: React.FC<Props> = ({ src }) => {
  const classes = useStyles();
  const image = useImageLoaded({ src });
  return (
    <Avatar
      alt="avatar-user"
      className={classes.avatar}
      src={image.isLoaded && src}
      children={image.status === ImageStatus.LOADING && <CircularProgress />}
    />
  );
};

export default React.memo(UserAvatar);
