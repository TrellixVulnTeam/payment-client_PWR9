import { PaymentType, Voucher } from '@mcuc/natasha/natasha_pb';
import React from 'react';
import { t } from 'i18next';

import Box from 'components/StyleGuide/Box';
import Grid from 'components/StyleGuide/Grid';
import ImageReceipt from 'components/ImageReceipt';
import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

import { formatCurrency } from 'utils/common';
import { BANKS, CURRENCY_TYPE } from 'utils/constant/payment';

interface Props {
  data: Voucher.AsObject;
}

const ConductVoucherDetail = (props: Props) => {
  const { data } = { ...props };
  const isReceiptVoucher =
    data?.type === PaymentType.MERCHANT_DEPOSIT_ADDITIONAL || data?.type === PaymentType.MERCHANT_DEPOSIT_COMPENSATION;

  return (
    <Paper background={PaperBackgrounds.regular} radius={PaperRadius.max}>
      <Box p={8}>
        <Grid container direction="column" spacing={8}>
          <Grid item>
            <Typography weight={TypoWeights.bold} variant={TypoVariants.head2}>
              {t('Conduct Detail')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container direction="column" spacing={4}>
              {/* row */}
              <Grid item>
                <Grid container spacing={3}>
                  {/* amount */}
                  <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>
                          {t('Amount')} ({CURRENCY_TYPE.VND})
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {formatCurrency(Math.abs(data.amount))}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* amount */}
                </Grid>
              </Grid>
              {/* row */}
              {/* row */}
              <Grid item>
                <Grid container spacing={3}>
                  {/* payee provider */}
                  <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>{t('Payee Provider')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {BANKS.find((item) => item.value === data.payeeProvider)?.name || '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* payee provider */}
                  {/* payee account */}
                  <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>{t('Payee Account')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {data.payeeAccount || '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* payee account */}
                  {/* payee name */}
                  <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>{t('Payee Name')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {data.payeeName || '-'}
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
                <Grid container spacing={3}>
                  {/* payer provider */}
                  <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>{t('Payer Provider')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {BANKS.find((item) => item.value === data.payerProvider)?.name || '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* payer provider */}
                  {/* payer account */}
                  <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>{t('Payer Account')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {data.payerAccount || '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* payer account */}
                  {/* payer name */}
                  <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>{t('Payer Name')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {data.payerName || '-'}
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
                <Grid container spacing={3}>
                  {/* amount */}
                  <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>
                          {t('Amount')} ({CURRENCY_TYPE.VND})
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {formatCurrency(Math.abs(data.amount)) || '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* amount */}
                  {/* TxID */}
                  <Grid item xs={12} md={4}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>TxID</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {data.txId || '-'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* TxID */}
                </Grid>
              </Grid>
              {/* row */}
              {/* row */}
              {/* row */}
              {/* row */}
              <Grid item>
                <Grid container spacing={2}>
                  {/* note */}
                  <Grid item xs={12}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography type={TypoTypes.titleSub}>
                          {t('{{name}} Attachment', { name: isReceiptVoucher ? t('Receipt') : t('Payment') })}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          <ImageReceipt imageUrl={data?.imageUrl} />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* note */}
                </Grid>
              </Grid>
              {/* row */}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ConductVoucherDetail;
