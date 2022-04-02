import React from 'react';
import { StatusEnum } from 'redux/constant';

import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import AlopayDialog from 'components/Dialog';
// import FormData from 'components/Form';
import Icon from 'components/StyleGuide/Icon';
import { sleep } from 'utils/common';
import { Grid } from '@material-ui/core';
import { Warning } from 'assets/icons/ILT';

type DialogDeleteRoleProps = { onClose: () => void; onDelete: (id: string) => void };

const DialogDeleteRole = ({ onClose, onDelete }: DialogDeleteRoleProps) => {
  const [statusLoading, setStatusLoading] = React.useState(StatusEnum.IDLE);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleSubmit = async () => {
    if (statusLoading === StatusEnum.LOADING) {
      return;
    }
    setStatusLoading(StatusEnum.LOADING);
    await sleep(2000);
    await onDelete('abc');
    onClose();
    setErrorMessage('');
    setStatusLoading(StatusEnum.IDLE);
  };

  return (
    <AlopayDialog
      fullWidth
      title={
        <Grid container spacing={2} alignItems="center">
          <Grid item xs="auto">
            <Icon component={Warning} color="#F53131" />
          </Grid>
          <Grid item xs="auto">
            <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
              Delete Role
            </Typography>
          </Grid>
        </Grid>
      }
      onClose={onClose}
      errorMessage={errorMessage}
      actions={
        <>
          <Button
            fullWidth
            type="submit"
            variant={ButtonVariants.danger}
            size={ButtonSizes.lg}
            loading={statusLoading === StatusEnum.LOADING}
            onClick={handleSubmit}
          >
            Delete
          </Button>
          <Button fullWidth variant={ButtonVariants.secondary} size={ButtonSizes.lg} onClick={onClose}>
            Cancel
          </Button>
        </>
      }
    >
      <Typography variant={TypoVariants.body1} type={TypoTypes.sub}>
        You are going to delete{' '}
        <Typography component="span" variant={TypoVariants.body1} type={TypoTypes.default} weight={TypoWeights.bold}>
          Role Teller
        </Typography>{' '}
        on list of Resource. Are you sure about this?
      </Typography>
    </AlopayDialog>
  );
};

export default DialogDeleteRole;
