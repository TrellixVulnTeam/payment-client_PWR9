import { t } from 'i18next';
import { Trans } from 'react-i18next';
import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import { StatusEnum } from 'redux/constant';
import { useAppSelector } from 'redux/store';
import { selectRoleEntities } from 'redux/features/role/slice';

import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { sleep } from 'utils/common';

type DialogSettingPermissionProps = { roleId: number; onClose: () => void; onConfirm: () => void };

const DialogSettingPermission = ({ roleId, onClose, onConfirm }: DialogSettingPermissionProps) => {
  const roles = useAppSelector(selectRoleEntities);
  const role = roles[roleId];

  const [statusLoading, setStatusLoading] = useState(StatusEnum.IDLE);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    if (statusLoading === StatusEnum.LOADING) return;
    setStatusLoading(StatusEnum.LOADING);
    await sleep(500);
    await onConfirm();
    onClose();
    setErrorMessage('');
    setStatusLoading(StatusEnum.IDLE);
  };

  return (
    <AlopayDialog
      fullWidth
      title={t('Confirm Setting Permission')}
      onClose={onClose}
      errorMessage={errorMessage}
      actions={
        <>
          <Box mb={2}>
            <Button
              fullWidth
              type="submit"
              size={ButtonSizes.lg}
              loading={statusLoading === StatusEnum.LOADING}
              onClick={handleSubmit}
            >
              {t('Confirm')}
            </Button>
          </Box>
          <Button fullWidth variant={ButtonVariants.secondary} size={ButtonSizes.lg} onClick={onClose}>
            {t('Cancel')}
          </Button>
        </>
      }
    >
      <Typography variant={TypoVariants.body1} type={TypoTypes.sub}>
        <Trans
          i18nKey={'You are changing the permission of <b>{{role}}</b>. Are you certain to update?'}
          values={{ role: role?.name || '' }}
          components={{
            b: (
              <Typography
                variant={TypoVariants.body1}
                component="span"
                type={TypoTypes.default}
                weight={TypoWeights.bold}
              />
            ),
          }}
        />
      </Typography>
    </AlopayDialog>
  );
};

export default DialogSettingPermission;
