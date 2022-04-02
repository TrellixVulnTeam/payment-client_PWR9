import * as React from 'react';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import Grid from '@material-ui/core/Grid';
import { t } from 'i18next';

import AllowedTo from 'components/AllowedTo';
import Button, { ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { getPermissionForApproveTopUp, getPermissionForRejectTopUp } from 'utils/constant/payment';
import Reject from 'assets/icons/ILT/lib/Reject';
import DialogApprove from '../DialogApprove';
import DialogRefused from '../DialogRefused';

type ButtonStatusProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const ButtonStatus: React.FunctionComponent<ButtonStatusProps> = ({ payment }) => {
  const [dialogActive, setDialogActive] = React.useState('');

  const performPermissionApprove = getPermissionForApproveTopUp(payment.payment?.method);
  const performPermissionReject = getPermissionForRejectTopUp(payment.payment?.method);

  const handleCloseDialog = React.useCallback(() => {
    console.log('running');
    setDialogActive('');
  }, []);

  return (
    <>
      <Grid container alignItems="center" spacing={1}>
        <Grid item>
          <AllowedTo perform={performPermissionReject}>
            <Button
              variant={ButtonVariants.invert}
              onClick={() => setDialogActive('refused')}
              startIcon={() => <Reject fontSize="medium" style={{ marginRight: 4 }} />}
            >
              <Typography variant={TypoVariants.body1} type={TypoTypes.error} weight={TypoWeights.bold}>
                {t('Reject')}
              </Typography>
            </Button>
          </AllowedTo>
        </Grid>
        <Grid item>
          <AllowedTo perform={performPermissionApprove}>
            <Button variant={ButtonVariants.primary} onClick={() => setDialogActive('approved')}>
              <Typography variant={TypoVariants.button1} type={TypoTypes.invert} weight={TypoWeights.medium}>
                {t('Approve')}
              </Typography>
            </Button>
          </AllowedTo>
        </Grid>
      </Grid>
      {dialogActive === 'approved' && <DialogApprove payment={payment} onClose={handleCloseDialog} />}
      {dialogActive === 'refused' && <DialogRefused payment={payment} onClose={handleCloseDialog} />}
    </>
  );
};

export default ButtonStatus;
