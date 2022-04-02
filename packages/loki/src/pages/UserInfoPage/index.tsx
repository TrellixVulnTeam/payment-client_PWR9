import i18n from 'i18n';
import { t } from 'i18next';
import _get from 'lodash-es/get';
import { Status as StatusAccount } from '@greyhole/myid/myid_pb';
import { iToast } from '@ilt-core/toast';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { StatusEnum } from 'redux/constant';
import { getListRolesThunk } from 'redux/features/role/thunks';
import { getListGroupThunk } from 'redux/features/group/thunks';
import { selectUserById, selectUserStatus } from 'redux/features/users/slice';
import { getUserThunk, resendCreatePasswordOTPThunk } from 'redux/features/users/thunks';
import { getListActionsThunk } from 'redux/features/action/thunks';
import { getListResourcesThunk } from 'redux/features/resource/thunks';
import { selectRoleEntities } from 'redux/features/role/slice';
import { selectGroupEntities } from 'redux/features/group/slice';

import Status from 'pages/UserProfile/Status';
import LayoutPaper from 'components/Layout/LayoutPaper';
import LayoutContainer from 'components/Layout/LayoutContainer';
import AllowedTo from 'components/AllowedTo';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { DateFormat } from 'components/Table/lib';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';

import { APP_NAME, sleep } from 'utils/common';
import { formatDateTime } from 'utils/date';
import { PerformPermission } from 'configs/routes/permission';
import { combinePhoneAndCountryCodeDisplay } from 'utils/common/phoneNumber';

import DialogAccountStatus from './DialogAccountStatus';
import ActionHistory from './ActionHistory';
import DialogEdit from './DialogEdit';
import Button, { ButtonVariants } from 'components/StyleGuide/Button';

export const columnsDefine = [
  {
    Header: i18n.t('Date & time'),
    accessor: (row: any) => <DateFormat date={row.joinDate} />,
  },
  {
    Header: i18n.t('Action'),
    accessor: 'id',
  },
];

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
      '& > *:not(:last-child)': {
        borderBottom: '1px solid #D6DEFF',
      },
    },
    userAvatar: {
      padding: theme.spacing(1, 4, 0, 1),
      width: '25%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    buttonUserAvatarReplace: {
      marginTop: theme.spacing(3),
    },
  }),
);

type StatusLoadingType = 'USER' | 'STATUS' | 'RESENDING' | 'IDLE';

const UserInfoPage = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const { id: userIdParam } = useParams<{ id: string }>();

  const userInfo = useAppSelector((state) => selectUserById(state, userIdParam));
  const userStatusLoading = useAppSelector(selectUserStatus);
  const roles = useAppSelector(selectRoleEntities);
  const groups = useAppSelector(selectGroupEntities);

  const [statusLoading, setStatusLoading] = useState<StatusLoadingType>('IDLE');

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/management/user-management',
        label: t('Management'),
      },
      {
        to: '/management/user-management',
        label: t('User management'),
      },
      {
        to: '',
        label: ` ${
          [StatusEnum.IDLE, StatusEnum.LOADING].includes(userStatusLoading) ? t('Loading...') : userInfo?.displayName
        }`,
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs, userStatusLoading, userInfo]);

  useEffect(() => {
    (async () => {
      if (userIdParam) {
        await dispatch(
          getUserThunk({
            id: parseInt(userIdParam),
          }),
        );
        dispatch(getListGroupThunk());
        dispatch(getListRolesThunk());
        dispatch(getListActionsThunk());
        dispatch(getListResourcesThunk());
      }
    })();
  }, [dispatch, userIdParam]);

  const handleResendActiveAccount = useCallback(async () => {
    setStatusLoading('RESENDING');
    await sleep(500);
    await dispatch(
      resendCreatePasswordOTPThunk({
        userId: userInfo.userId,
      }),
    );
    iToast.success({
      title: 'Success',
      msg: t('Resend email active account successfully'),
    });
    setStatusLoading('IDLE');
  }, [dispatch, userInfo?.userId]);

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
              text: userInfo.metadata?.fullName || '-',
            },
            {
              title: t('Group'),
              text: groups[_get(userInfo, 'rolesList[0].groupId')]?.name || '-',
            },
            {
              title: t('Role'),
              text: roles[_get(userInfo, 'rolesList[0].roleId')]?.name || '-',
            },
            {
              title: t('Phone number'),
              text: combinePhoneAndCountryCodeDisplay(userInfo.phone) || '-',
            },
            {
              title: t('Email'),
              text: userInfo.email,
            },
            {
              title: t('Created date'),
              text: (
                <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {userInfo.createdAt && userInfo.createdAt?.seconds !== 0
                    ? formatDateTime(userInfo.createdAt?.seconds * 1000)
                    : '-'}
                </Typography>
              ),
            },
            {
              title: t('Last sign in'),
              text: (
                <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {userInfo.lastSignedIn && userInfo.lastSignedIn?.seconds !== 0
                    ? formatDateTime(userInfo.lastSignedIn?.seconds * 1000)
                    : '-'}
                </Typography>
              ),
            },
            {
              title: t('Status'),
              text: (
                <Box display="flex">
                  <Status status={userInfo.status} />
                  {userInfo.status === StatusAccount.INACTIVE && (
                    <AllowedTo
                      perform={PerformPermission.userManagementUserList.resendCreatePasswordOtp}
                      watch={[statusLoading, handleResendActiveAccount]}
                    >
                      <Box ml={1}>
                        <Button
                          style={{ padding: 0, paddingTop: 3 }}
                          fullWidth={false}
                          variant={statusLoading === 'RESENDING' ? ButtonVariants.primary : ButtonVariants.ghost}
                          loading={statusLoading === 'RESENDING'}
                          onClick={handleResendActiveAccount}
                        >
                          <Typography variant={TypoVariants.body2} type={TypoTypes.primary} weight={TypoWeights.bold}>
                            ({t('Resend active')})
                          </Typography>
                        </Button>
                      </Box>
                    </AllowedTo>
                  )}
                </Box>
              ),
            },
          ]
        : [],
    [groups, roles, userInfo, statusLoading, handleResendActiveAccount],
  );

  if (!userInfo) return null;

  return (
    <>
      <Helmet>
        <title>
          {t('Edit {{key}}', { key: t('User').toLowerCase() })} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer
        center
        header={t('Edit {{key}}', { key: t('User').toLowerCase() })}
        maxWidth="lg"
        actions={userInfo.status ? <DialogAccountStatus /> : null}
      >
        <Grid container spacing={3}>
          <Grid item xl={12} lg={12} md={12}>
            <LayoutPaper header={t('Basic information')} actions={<DialogEdit />}>
              <Box className={classes.user}>
                <Box className={classes.userAvatar}>
                  <Avatar alt="avatar-user" src={userInfo.metadata?.picture} className={classes.avatar} />
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
          <AllowedTo perform={PerformPermission.userManagementUserActionLog.listLogs}>
            <Grid item xl={12} lg={12} md={12}>
              <ActionHistory />
            </Grid>
          </AllowedTo>
        </Grid>
      </LayoutContainer>
    </>
  );
};

export default UserInfoPage;
