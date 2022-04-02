import { Avatar } from '@material-ui/core';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Typography, { TypoVariants } from 'components/StyleGuide/Typography';
import { UserInfoCustom } from 'redux/features/users/types';

interface Props {
  userInfo: UserInfoCustom;
}

export const ProfileAvatar: React.FC<Props> = ({ userInfo }) => {
  const classes = useStyles();
  const firstNameInitial = userInfo.username[0] ?? null;

  return (
    <div className={classes.root}>
      <Avatar
        alt={userInfo.username}
        src={userInfo.metadata.picture}
        classes={{
          root: classes.MuiAvatarRoot,
        }}
      >
        {firstNameInitial}
      </Avatar>
      <Typography component="span" variant={TypoVariants.button1} style={{ marginLeft: 8 }}>
        {userInfo.displayName}
      </Typography>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    MuiAvatarRoot: {
      height: '20px',
      width: '20px',
      // styleName: 'Title (Semi Bold-600)/Title 4',
      fontFamily: 'Inter',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '20px',
      letterSpacing: '0.25px',
      textAlign: 'center',
    },
  }),
);
