import { t } from 'i18next';
import _capitalize from 'lodash-es/capitalize';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import ImageReceipt from 'components/ImageReceipt';
import Alert from 'components/StyleGuide/Alert';
import Box from 'components/StyleGuide/Box';
import Grid from 'components/StyleGuide/Grid';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

import { formatCurrency } from 'utils/common';
import { BANKS, CURRENCY_TYPE } from 'utils/constant/payment';
import styles from './styles.module.scss';

interface Props {
  onNext: () => void;
  onBack: () => void;
  onFirst: () => void;
  onClose: () => void;
  callback: () => void;
  msgError: string;
  isReceiptVoucher: boolean;
}

const Step2ReviewConductVoucher = (props: Props) => {
  const { isReceiptVoucher, msgError } = { ...props };
  const { getValues } = useFormContext();
  const { payeeProvider, payeeAccount, payeeName, payerProvider, payerAccount, payerName, amount, txID, note, photo } =
    getValues();

  return (
    <div className={styles['root']}>
      <Grid container direction="column" spacing={6}>
        {/* row */}
        <Grid item>
          <Grid container spacing={2}>
            {/* payee provider */}
            <Grid item xs={12} md={4}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>{t('Payee provider')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {BANKS.find((item) => item.value === payeeProvider)?.name}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* payee provider */}
            {/* payee account */}
            <Grid item xs={12} md={4}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>{t('Payee account')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {payeeAccount}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* payee account */}
            {/* payee name */}
            <Grid item xs={12} md={4}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>{t('Payee name')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {payeeName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* payee name */}
          </Grid>
        </Grid>
        {/* row */}
        {/* row */}
        <Grid item>
          <Grid container spacing={2}>
            {/* payer provider */}
            <Grid item xs={12} md={4}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>{t('Payer provider')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {BANKS.find((item) => item.value === payerProvider)?.name}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* payer provider */}
            {/* payer account */}
            <Grid item xs={12} md={4}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>{t('Payer account')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {payerAccount}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* payer account */}
            {/* payer name */}
            <Grid item xs={12} md={4}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>{t('Payer name')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {payerName}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* payer name */}
          </Grid>
        </Grid>
        {/* row */}
        {/* row */}
        <Grid item>
          <Grid container spacing={2}>
            {/* payer provider */}
            <Grid item xs={12} md={4}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>
                    {t('Amount')} ({CURRENCY_TYPE.VND})
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {formatCurrency(Math.abs(amount))}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* payer provider */}
            {/* TxID */}
            <Grid item xs={12} md={4}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>{t('TxID')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {txID}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* TxID */}
          </Grid>
        </Grid>
        {/* row */}
        {/* row */}
        <Grid item>
          <Grid container spacing={2}>
            {/* note */}
            <Grid item xs={12}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>{t('Note')}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    {note}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* note */}
          </Grid>
        </Grid>
        {/* row */}
        {/* row */}
        <Grid item>
          <Grid container spacing={2}>
            {/* note */}
            <Grid item xs={12}>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography type={TypoTypes.titleSub}>
                    {t('{{name}} photo', { name: isReceiptVoucher ? t('Receipt') : t('Payment') })}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                    <ImageReceipt imageUrl={photo?.fullUrl} />
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {/* note */}
          </Grid>
        </Grid>
        {/* row */}
        {/* row */}
        {msgError && (
          <Grid item>
            <Box pb={1}>
              <Alert severity="error">
                <Grid container direction="column" spacing={1}>
                  <Grid item>{_capitalize(msgError)}</Grid>
                </Grid>
              </Alert>
            </Box>
          </Grid>
        )}
        {/* row */}
      </Grid>
    </div>
  );
};

export default React.memo(Step2ReviewConductVoucher);
