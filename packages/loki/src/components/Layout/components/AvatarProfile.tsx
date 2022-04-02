import Box from '@material-ui/core/Box';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Skeleton from '@material-ui/lab/Skeleton';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles } from '@material-ui/core/styles';
import { t } from 'i18next';
import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { logout, selectUserInfo } from 'redux/features/auth/slice';

import { ProfileAvatar } from 'components/ProfileAvatar';
import Paper from 'components/StyleGuide/Paper';
import Icon from 'components/StyleGuide/Icon';
import AllowedTo from 'components/AllowedTo';
import DialogChangePassword from 'components/Dialog/ChangePassword';
import Typography, { TypoVariants } from 'components/StyleGuide/Typography';
import { LOGIN, USER_PROFILE as PATH_USER_PROFILE } from 'configs/routes/path';
import { PerformPermission } from 'configs/routes/permission';
import { AngleDown, Lock, Logout, UserProfile } from 'assets/icons/ILT';

const useStyles = makeStyles((theme) => {
  return {
    languages: {
      border: 'none',
      width: '180px',
    },
    dropdownButton: {
      fontWeight: 600,
      fontSize: 16,
      lineHeight: '150%',
      letterSpacing: 0.5,
      borderRadius: 8,
      border: '1px solid #fff',
      padding: '8px 10px 8px 16px',
      '&:hover , &.active': {
        backgroundColor: '#D6DEFF',
      },
    },
    icon: {
      width: 20,
      height: 20,
      color: '#031352',
    },
  };
});

type Dialog = {
  name: 'PASSWORD' | undefined;
  value: unknown;
};

const AvatarProfile: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useAppDispatch();

  const userInfo = useAppSelector(selectUserInfo);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const [dialog, setDialog] = useState<Dialog>({
    name: undefined,
    value: undefined,
  });

  const handleCloseDialog = () =>
    setDialog({
      name: undefined,
      value: undefined,
    });

  const handleChangePassword = () => {
    setDialog({ name: 'PASSWORD', value: undefined });
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleRedirectUserProfile = () => history.push(PATH_USER_PROFILE);
  const handleLogout = () => {
    dispatch(logout());
    history.push(LOGIN);
  };

  const handleClosePopper = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  if (!userInfo) return <Skeleton />;

  return (
    <>
      <Button
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="menu"
        onClick={handleToggle}
        className={`${classes.dropdownButton} ${open ? 'active' : ''}`}
        endIcon={<AngleDown />}
      >
        <Box display="flex" alignItems="center">
          <ProfileAvatar userInfo={userInfo} />
        </Box>
      </Button>
      <Popper
        id={open ? 'menu-list-grow' : undefined}
        open={open}
        anchorEl={anchorRef.current}
        transition
        placement="top-end"
        style={{ zIndex: 99999 }}
        modifiers={{
          offset: {
            enabled: true,
            offset: '0, 8', // https://popper.js.org/docs/v1/#modifiersoffset
          },
        }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'top-end' : 'bottom-end',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClosePopper}>
                <MenuList id="menu-list-grow" onClick={handleToggle}>
                  <AllowedTo perform={PerformPermission.profile.updateMetadata}>
                    <MenuItem value="username" onClick={handleRedirectUserProfile}>
                      <Box display="flex" alignItems="center">
                        <Box mr={1}>
                          <Icon className={classes.icon} component={UserProfile} />
                        </Box>
                        <Typography variant={TypoVariants.button1}>{t('Personal profile')}</Typography>
                      </Box>
                    </MenuItem>
                  </AllowedTo>

                  <AllowedTo perform={PerformPermission.profile.changePassword}>
                    <MenuItem value="username" onClick={handleChangePassword}>
                      <Box display="flex" alignItems="center">
                        <Box mr={1}>
                          <Icon className={classes.icon} component={Lock} />
                        </Box>
                        <Typography variant={TypoVariants.button1}>{t('Change password')}</Typography>
                      </Box>
                    </MenuItem>
                  </AllowedTo>

                  <MenuItem value="username" onClick={handleLogout}>
                    <Box display="flex" alignItems="center">
                      <Box mr={1}>
                        <Icon className={classes.icon} component={Logout} />
                      </Box>
                      <Typography variant={TypoVariants.button1}>{t('Log out')}</Typography>
                    </Box>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
      {dialog.name === 'PASSWORD' && <DialogChangePassword onClose={handleCloseDialog} />}
    </>
  );
};

export default AvatarProfile;
