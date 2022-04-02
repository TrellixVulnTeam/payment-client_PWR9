import { Grid } from '@material-ui/core';
import { SystemBank, BankStatus } from '@mcuc/stark/pepper_pb';
import { t } from 'i18next';
import React from 'react';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectSelectedBankInfo } from 'redux/features/walletBanks/slice';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import Status from '../Status';

interface Props {}

const ConfirmChangeStatusModalContent = (props: Props) => {
  const selectedBankInfo: SystemBank.AsObject = useSelector(selectSelectedBankInfo);
  const status = selectedBankInfo?.status; // current status

  function renderStatusText(status: number) {
    return status === BankStatus.BANK_STATUS_ACTIVE ? t('Deactivate').toLowerCase() : t('Active').toLowerCase();
  }

  if (!selectedBankInfo) return null;

  return (
    <Grid container direction="column" spacing={2}>
      {/* row */}
      <Grid item>
        <Typography variant={TypoVariants.body1}>
          <Trans
            i18nKey={`Are you certain to <b>{{status}}<b/> the status of the account id <b>{{id}}<b/>? You still have permission to activate it again if you need it.`}
            values={{
              id: selectedBankInfo.id || '',
              status: renderStatusText(status === BankStatus.BANK_STATUS_ACTIVE ? 0 : 1),
            }}
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
      </Grid>
      {/* row */}
      {/* row */}
      <Grid item>
        <Typography component="span" variant={TypoVariants.body1} weight={TypoWeights.bold}>
          {t('Preview')}
        </Typography>
      </Grid>
      {/* row */}
      {/* row */}
      <Grid item>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography variant={TypoVariants.body1} weight={TypoWeights.medium} type={TypoTypes.sub}>
                  {t('Current status')}
                </Typography>
              </Grid>
              <Grid item>
                <Status status={status === BankStatus.BANK_STATUS_ACTIVE ? 1 : 0} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography variant={TypoVariants.body1} weight={TypoWeights.medium} type={TypoTypes.sub}>
                  {t('New status')}
                </Typography>
              </Grid>
              <Grid item>
                <Status status={status === BankStatus.BANK_STATUS_ACTIVE ? 0 : 1} />
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
