import { EWalletStatus, SystemEWallet } from '@mcuc/stark/tony_pb';
import { Grid } from '@material-ui/core';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import React from 'react';

import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { selectSelectedWalletInfo } from 'redux/features/walletEWallets/slice';
import Status from '../Status';

interface Props {}

const ConfirmChangeStatusModalContent = (props: Props) => {
  const selectedEWalletInfo: SystemEWallet.AsObject = useSelector(selectSelectedWalletInfo);
  const status = selectedEWalletInfo?.status; // current status

  function renderStatusText(status: number) {
    return status === EWalletStatus.EWALLET_ACTIVE ? t('Deactivate').toLowerCase() : t('Active').toLowerCase();
  }

  if (!selectedEWalletInfo) return null;

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant={TypoVariants.body1}>
          <Trans
            i18nKey={`Are you certain to <b>{{status}}<b/> the status of the account id <b>{{id}}<b/>? You still have permission to activate it again if you need it.`}
            values={{
              id: selectedEWalletInfo.id || '',
              status: renderStatusText(status === EWalletStatus.EWALLET_ACTIVE ? 0 : 1),
            }}
            components={{
              b: (
                <Typography
                  component="span"
                  variant={TypoVariants.body1}
                  type={TypoTypes.default}
                  weight={TypoWeights.bold}
                />
              ),
            }}
          />
        </Typography>
      </Grid>
      <Grid item>
        <Typography component="span" variant={TypoVariants.body1} weight={TypoWeights.bold}>
          {t('Preview')}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography color="textSecondary">{t('Current status')}</Typography>
              </Grid>
              <Grid item>
                <Status status={status === EWalletStatus.EWALLET_ACTIVE ? 1 : 0} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography color="textSecondary">{t('New status')}</Typography>
              </Grid>
              <Grid item>
                <Status status={status === EWalletStatus.EWALLET_ACTIVE ? 0 : 1} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* row */}
    </Grid>
  );
};

export default React.memo(ConfirmChangeStatusModalContent);
