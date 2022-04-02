import { Box } from '@material-ui/core';
import React, { useState } from 'react';
import { StatusEnum } from 'redux/constant';

import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { sleep } from 'utils/common';
import { t } from 'i18next';

type DialogConfirmProps = { onClose: () => void; onConfirm: () => void };

const DialogConfirm = ({ onClose, onConfirm }: DialogConfirmProps) => {
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
      title={t('Confirm setting')}
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
        {t('You are changing settings. Are you certain to update?')}
      </Typography>
    </AlopayDialog>
  );
};

export default DialogConfirm;
