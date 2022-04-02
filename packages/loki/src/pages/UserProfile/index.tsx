import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { t } from 'i18next';
import { useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getMeThunk, updateMetadataThunk } from 'redux/features/auth/thunks';
import { selectUserInfo } from 'redux/features/auth/slice';
import { selectRoleEntities } from 'redux/features/role/slice';
import { selectGroupEntities } from 'redux/features/group/slice';
import { getListRolesThunk } from 'redux/features/role/thunks';
import { getListGroupThunk } from 'redux/features/group/thunks';
import { getListResourcesThunk } from 'redux/features/resource/thunks';
import { getListActionsThunk } from 'redux/features/action/thunks';

import LayoutPaper from 'components/Layout/LayoutPaper';
import LayoutContainer from 'components/Layout/LayoutContainer';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';

import { UploadResponseResult } from 'services/restful/upload';
import { formatDateTime } from 'utils/date';
import { APP_NAME } from 'utils/common';
import { combinePhoneAndCountryCodeDisplay } from 'utils/common/phoneNumber';

import Status from './Status';
import UserAvatar from './UserAvatar';
import UploadAvatar from './UploadAvatar';
import ActionHistory from './ActionHistory';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      width: '120px',
      height: '120px',
      border: `3px solid ${theme.palette.primary.main}`,
    },
    user: {
      display: 'flex',
    },
    userInfo: {
      width: '75%',
      borderLeft: '1px solid #D6DEFF',
      paddingLeft: theme.spacing(3),
    },
    userAvatar: {
      padding: theme.spacing(1, 4, 0, 1),
      width: '25%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }),
);

const UserProfile = () => {
  const classes = useStyles();

  const dispatch = useAppDispatch();

  const userInfo = useAppSelector(selectUserInfo);
  const roles = useAppSelector(selectRoleEntities);
  const groups = useAppSelector(selectGroupEntities);

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/user-profile',
        label: t('Personal profile'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  useEffect(() => {
    dispatch(getMeThunk());
    dispatch(getListGroupThunk());
    dispatch(getListRolesThunk());
    dispatch(getListActionsThunk());
    dispatch(getListResourcesThunk());
  }, [dispatch]);

  const handleSubmitAvatar = async (data: UploadResponseResult) => {
    const fullPath = process.env.REACT_APP_GET_RESOURCE_URL + data?.path;
    await dispatch(
      updateMetadataThunk({
        metadata: JSON.stringify({
          ...userInfo.metadata,
          picture: fullPath,
        }),
      }),
    );
  };

  const fields = useMemo(
    () =>
      userInfo
        ? [
            {
              title: t('Username'),
              text: userInfo.username,
            },
            {
              title: t('Full name'),
              text: userInfo.metadata?.fullName,
            },
            {
              title: t('Group'),
              text: groups[userInfo.rolesList[0].groupId]?.name || '-',
            },
            {
              title: t('Role'),
              text: roles[userInfo.rolesList[0].roleId]?.name || '-',
            },
            {
              title: t('Phone number'),
              text: combinePhoneAndCountryCodeDisplay(userInfo.phone),
            },
            {
              title: t('Email'),
              text: userInfo.email,
            },
            {
              title: t('Created date'),
              text: (
                <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {userInfo.createdAt && userInfo.createdAt.seconds !== 0
                    ? formatDateTime(userInfo.createdAt.seconds * 1000)
                    : '-'}
                </Typography>
              ),
            },
            {
              title: t('Last sign in'),
              text: (
                <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {userInfo.lastSignedIn && userInfo.lastSignedIn.seconds !== 0
                    ? formatDateTime(userInfo.lastSignedIn.seconds * 1000)
                    : '-'}
                </Typography>
              ),
            },
            {
              title: t('Status'),
              text: <Status status={userInfo.status} />,
            },
          ]
        : [],
    [groups, roles, userInfo],
  );

  return (
    <>
      <Helmet>
        <title>
          {t('Personal profile')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer center header={t('Personal profile')} maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xl={12} lg={12} md={12}>
            <LayoutPaper header={t('Basic information')}>
              <Box className={classes.user}>
                <Box className={classes.userAvatar}>
                  <Grid container spacing={2} direction="column" alignItems="center">
                    <Grid item>
                      <UserAvatar src={userInfo.metadata?.picture} />
                    </Grid>
                    <Grid item>
                      <UploadAvatar onSubmit={handleSubmitAvatar} />
                    </Grid>
                  </Grid>
                </Box>
                <Box className={classes.userInfo}>
                  <>
                    <Grid container spacing={4}>
                      {fields.map((field) => (
                        <Grid item xs={12} lg={6}>
                          <Grid container spacing={1} direction="column">
                            <Grid item>
                              <Typography variant={TypoVariants.body2}>{field.title}</Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                                {field.text}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                </Box>
              </Box>
            </LayoutPaper>
          </Grid>
          <Grid item xl={12} lg={12} md={12}>
            <ActionHistory />
          </Grid>
        </Grid>
      </LayoutContainer>
    </>
  );
};

export default UserProfile;
