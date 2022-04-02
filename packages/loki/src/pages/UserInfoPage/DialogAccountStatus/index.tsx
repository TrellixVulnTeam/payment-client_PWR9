import { useParams } from 'react-router-dom';
import { iToast } from '@ilt-core/toast';
import { Status as StatusAccount } from '@greyhole/myid/myid_pb';
import { t } from 'i18next';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { lockUserThunk, unlockUserThunk } from 'redux/features/users/thunks';
import AllowedTo from 'components/AllowedTo';
import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { sleep } from 'utils/common';
import { selectUserById } from 'redux/features/users/slice';
import { PerformPermission } from 'configs/routes/permission';

const DialogAccountStatus: React.FC = () => {
  const dispatch = useAppDispatch();

  const { id: userIdParam } = useParams<{ id: string }>();
  const userInfo = useAppSelector((state) => selectUserById(state, userIdParam));

  const [open, setOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState('idle');

  const isLocked = userInfo.status === StatusAccount.LOCKED;

  const handleLockUser = async () => {
    setStatusLoading('loading');
    await sleep(300);
    const { response, error } = await dispatch(
      lockUserThunk({
        id: userInfo.userId,
      }),
    ).unwrap();

    if (response && response.user) {
      iToast.success({
        title: 'Success',
        msg: t(`Account already has been deactived by admin`),
      });
      handleClose();
    } else {
      iToast.error({
        title: 'Error',
        msg: error.message,
      });
    }
    setStatusLoading('idle');
  };

  const handleUnlockUser = async () => {
    setStatusLoading('loading');
    const { response, error } = await dispatch(
      unlockUserThunk({
        id: userInfo.userId,
      }),
    ).unwrap();

    if (response && response.user) {
      iToast.success({
        title: 'Success',
        msg: t(`Account already has been activated by admin`),
      });
      handleClose();
    } else {
      iToast.error({
        title: 'Error',
        msg: error.message,
      });
    }
    setStatusLoading('idle');
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <AllowedTo
        perform={
          isLocked
            ? PerformPermission.userManagementUserList.unlockUser
            : PerformPermission.userManagementUserList.lockUser
        }
        watch={[isLocked]}
      >
        <Button onClick={handleOpen} variant={isLocked ? ButtonVariants.primary : ButtonVariants.danger}>
          {isLocked ? t('Unlock') : t('Lock')}
        </Button>
      </AllowedTo>
      <AlopayDialog
        open={open}
        title={isLocked ? t('Unlock {{name}}', { name: t('User') }) : t('Lock User', { name: t('User') })}
        onClose={handleClose}
        maxWidth="sm"
        actions={
          <>
            <Button
              size={ButtonSizes.lg}
              variant={isLocked ? ButtonVariants.primary : ButtonVariants.danger}
              onClick={isLocked ? handleUnlockUser : handleLockUser}
              loading={statusLoading === 'loading'}
            >
              {t('Confirm')}
            </Button>
            <Button size={ButtonSizes.lg} variant={ButtonVariants.secondary} onClick={handleClose}>
              {t('Cancel')}
            </Button>
          </>
        }
      >
        <Typography variant={TypoVariants.body1} type={TypoTypes.sub}>
          {t('You are going to {{action}} the account of {{name}}. Are you certain to continue?', {
            action: isLocked ? t('Unlock') : t('Lock'),
            name: userInfo.metadata.fullName,
          })}
        </Typography>
      </AlopayDialog>
    </>
  );
};

export default DialogAccountStatus;
