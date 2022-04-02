import { GetMerchantBalanceReply } from '@mcuc/natasha/natasha_pb';
import { Box, Grid } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/reducers';
import { useTranslation } from 'react-i18next';

import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { formatCurrency } from 'utils/common';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import { PerformPermission } from 'configs/routes/permission';
import VoucherBox from './VoucherBox';
import styles from './styles.module.scss';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';

interface Props {
  balance: GetMerchantBalanceReply.AsObject;
}

const MerchantVoucher: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const { balance } = { ...props };
  const merchant = useSelector((state: RootState) => state.merchants.selected);

  return (
    <div className={styles['root']}>
      <Paper radius={PaperRadius.max}>
        <Box p={4}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
                {t('Voucher')} ({CURRENCY_TYPE.VND})
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {/* total fund */}
                <Grid item xs={12} md={6}>
                  <Paper background={PaperBackgrounds.ghost} radius={PaperRadius.bold}>
                    <Box p={3}>
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <Typography variant={TypoVariants.head3}>
                            {t('Total Available Withdrawal Fund')} ({CURRENCY_TYPE.VND})
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant={TypoVariants.head1} type={TypoTypes.secondary}>
                            {formatCurrency(balance?.balanceForMexWithdrawFunds || 0)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>
                {/* total fund */}
                {/* total profit */}
                <Grid item xs={12} md={6}>
                  <Paper background={PaperBackgrounds.ghost} radius={PaperRadius.bold}>
                    <Box p={3}>
                      <Grid container direction="column" spacing={1}>
                        <Grid item>
                          <Typography variant={TypoVariants.head3}>
                            {t('Total Available Withdrawal Profit')} ({CURRENCY_TYPE.VND})
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant={TypoVariants.head1} type={TypoTypes.secondary}>
                            {formatCurrency(balance?.balanceForMexWithdrawProfit || 0)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>
                {/* total profit */}
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <VoucherBox
                perform={PerformPermission.merchantReceipt.listVouchers}
                title={`${uppercaseFirstLetterAllWords(t('Receipt voucher'))} (${CURRENCY_TYPE.VND})`}
                total={balance?.receiptVoucher?.total}
                value={balance?.receiptVoucher?.totalIn30days}
                percent={balance?.receiptVoucher?.percent || 0}
                link={`/merchant/${merchant.id}/receipt`}
              />
            </Grid>
            <Grid item xs={12}>
              <VoucherBox
                perform={PerformPermission.merchantPayment.listVouchers}
                title={`${uppercaseFirstLetterAllWords(t('Payment voucher'))} (${CURRENCY_TYPE.VND})`}
                total={balance?.paymentVoucher?.total}
                value={balance?.paymentVoucher?.totalIn30days}
                percent={balance?.paymentVoucher?.percent || 0}
                link={`/merchant/${merchant.id}/payment`}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default MerchantVoucher;
