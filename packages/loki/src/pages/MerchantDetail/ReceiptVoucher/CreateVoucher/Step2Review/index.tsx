import { GetMerchantBalanceReply, PaymentType } from '@mcuc/natasha/natasha_pb';
import { Box, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useTranslation } from 'react-i18next';

import { format } from 'date-fns';
import _capitalize from 'lodash-es/capitalize';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import Divider from 'components/StyleGuide/Divider';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { formatCurrency } from 'utils/common';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import styles from './styles.module.scss';

interface Props {
  onNext: () => void;
  onBack: () => void;
  onFirst: () => void;
  onClose: () => void;
  callback: () => void;
  msgError: string;
  balance: GetMerchantBalanceReply.AsObject;
  isPaymentVoucher?: boolean;
  VoucherOptions: { name: string; value: number }[];
}

const Step2Review = (props: Props) => {
  const { t } = useTranslation();

  const { VoucherOptions, balance, msgError } = { ...props };

  const { getValues } = useFormContext();
  const { time, voucherType, voucherAmount, note } = getValues();

  return (
    <div className={styles['root']}>
      <Grid container direction="column" spacing={2}>
        {/* row */}
        <Grid item>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography type={TypoTypes.titleSub}>Time</Typography>
            </Grid>
            <Grid item>
              <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                {time && format(time, 'dd MMM, yyyy')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* row */}
        {/* row */}
        <Grid item>
          <Divider />
        </Grid>
        {/* row */}
        <Grid container item spacing={4}>
          {/* row */}
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography type={TypoTypes.titleSub}>{t('Voucher Type')}</Typography>
              </Grid>
              <Grid item>
                <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {VoucherOptions.find((item) => item.value === voucherType)?.name || '-'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* row */}
          {/* row */}
          <Grid item xs={12} md={6}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <Typography type={TypoTypes.titleSub}>
                  {t('Voucher amount')} ({CURRENCY_TYPE.VND})
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {formatCurrency(Math.abs(voucherAmount))}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* row */}
        </Grid>
        {/* row */}
        <Grid item>
          <Divider />
        </Grid>
        {/* row */}
        {/* row */}
        <Grid item>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography type={TypoTypes.titleSub}>Note</Typography>
            </Grid>
            <Grid item>
              <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                {note || '---------'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* row */}
        {/* row */}
        <Grid item>
          <Divider />
        </Grid>
        {/* row */}
        {/* row */}
        {msgError && (
          <Grid item>
            <Box pb={1}>
              <Alert severity="error">
                <Grid container direction="column" spacing={1}>
                  <Grid item>{_capitalize(msgError)}</Grid>
                  <Grid item>
                    Current {voucherType === PaymentType.MERCHANT_WITHDRAW_FUNDS ? 'Funds' : 'Profits'}:{' '}
                    <Typography weight={TypoWeights.bold}>
                      {formatCurrency(
                        (voucherType === PaymentType.MERCHANT_WITHDRAW_FUNDS
                          ? balance?.balanceForMexWithdrawFunds
                          : balance?.balanceForMexWithdrawProfit) || 0,
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Alert>
            </Box>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default React.memo(Step2Review);
