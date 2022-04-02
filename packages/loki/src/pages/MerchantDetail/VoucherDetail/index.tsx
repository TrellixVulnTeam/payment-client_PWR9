import { PaymentType, VoucherStatus } from '@mcuc/natasha/natasha_pb';
import { Box, CircularProgress } from '@material-ui/core';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { StatusEnum } from 'redux/constant';
import { selectMerchantSelected } from 'redux/features/merchants/slice';
import { getMerchantThunk } from 'redux/features/merchants/thunks';
import { selectVoucher, selectVoucherStatus } from 'redux/features/vouchers/slice';
import { getVoucherThunk } from 'redux/features/vouchers/thunks';
import { useAppDispatch, useAppSelector } from 'redux/store';

import AllowedTo from 'components/AllowedTo';
import Grid from 'components/StyleGuide/Grid';
import Divider from 'components/StyleGuide/Divider';
import LayoutContainer from 'components/Layout/LayoutContainer';
import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { PerformPermission } from 'configs/routes/permission';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';

import { formatCurrency, APP_NAME } from 'utils/common';
import { formatWithSchema } from 'utils/date';
import { CURRENCY_TYPE } from 'utils/constant/payment';

import { PaymentVoucherTypes } from '../PaymentVoucher/const';
import { ReceiptVoucherTypes } from '../ReceiptVoucher/const';
import VoucherStatusComp from '../VoucherStatus';
import ApproveVoucher from './ApproveVoucher';
import CancelVoucher from './CancelVoucher';
import ConductVoucherDetail from './ConductVoucherDetail';
import PerformedByVoucherDetail from './PerformedByVoucherDetail';
import styles from './styles.module.scss';

interface Props {}

const VoucherDetail = (props: Props) => {
  const { id, voucherId } = useParams<{ id: string; voucherId: string }>();

  const dispatch = useAppDispatch();
  const { setBreadcrumbs } = useBreadcrumbs();

  const merchant = useAppSelector(selectMerchantSelected);
  const voucher = useAppSelector(selectVoucher);
  const voucherStatus = useAppSelector(selectVoucherStatus);

  const isReceiptVoucher =
    voucher?.type === PaymentType.MERCHANT_DEPOSIT_ADDITIONAL ||
    voucher?.type === PaymentType.MERCHANT_DEPOSIT_COMPENSATION;

  useEffect(() => {
    dispatch(getMerchantThunk({ id: +id }));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getVoucherThunk({ id: +voucherId }));
  }, [dispatch, voucherId]);

  useEffect(() => {
    if (!!merchant) {
      const breadcrumbs: IBreadcrumb[] = [
        {
          to: '/merchant',
          label: t('Merchant'),
        },
        {
          to: `/merchant/detail/${merchant.id}`,
          label: merchant.name,
        },
        {
          to: `/merchant/${merchant.id}/${isReceiptVoucher ? 'receipt' : 'payment'}`,
          label: `${t(isReceiptVoucher ? 'Receipt Voucher Detail' : 'Payment Voucher Detail')}`,
        },
        {
          to: ``,
          label: voucherId,
          active: true,
        },
      ];
      setBreadcrumbs(breadcrumbs);
    }
  }, [setBreadcrumbs, merchant, voucherId, isReceiptVoucher]);

  if (!voucher) return null;
  return (
    <div className={styles['root']}>
      <Helmet>
        <title>
          {t('Voucher detail')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer center header={null} maxWidth="md">
        {/* header */}
        <Grid item>
          <Box pb={4}>
            <Grid container alignItem="center" justifyContent="space-between">
              <Grid item xs="auto">
                <Typography weight={TypoWeights.bold} variant={TypoVariants.head1}>
                  {isReceiptVoucher ? t('Receipt') : t('Payment')} {t('Voucher ID')}: {voucherId}
                </Typography>
              </Grid>
              {![StatusEnum.LOADING, StatusEnum.IDLE].includes(voucherStatus) &&
                voucher.status === VoucherStatus.PROCESSING && (
                  <Grid item xs="auto">
                    <Grid container spacing={2}>
                      {[PaymentType.MERCHANT_WITHDRAW_FUNDS, PaymentType.MERCHANT_WITHDRAW_PROFIT].indexOf(
                        voucher.type,
                      ) !== -1 && (
                        <Grid item xs="auto">
                          <AllowedTo perform={PerformPermission.merchantPayment.cancelVoucher}>
                            <CancelVoucher />
                          </AllowedTo>
                        </Grid>
                      )}
                      <Grid item xs="auto">
                        <AllowedTo
                          perform={
                            isReceiptVoucher
                              ? PerformPermission.merchantReceipt.submitVoucher
                              : PerformPermission.merchantPayment.submitVoucher
                          }
                        >
                          <ApproveVoucher />
                        </AllowedTo>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
            </Grid>
          </Box>
        </Grid>
        {/* header */}
        {[StatusEnum.LOADING, StatusEnum.IDLE].includes(voucherStatus) ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container direction="column" spacing={6}>
            {/* conduct detail */}
            {voucher && voucher.status === VoucherStatus.COMPLETED && (
              <Grid item>
                <ConductVoucherDetail data={voucher} />
              </Grid>
            )}
            {/* conduct detail */}
            {/* information */}
            <Grid item>
              <Paper background={PaperBackgrounds.regular} radius={PaperRadius.max}>
                <Box p={4}>
                  <Grid container direction="column" spacing={8}>
                    <Grid item>
                      <Typography weight={TypoWeights.bold} variant={TypoVariants.head2}>
                        {t('Information')}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Grid container direction="column" spacing={4}>
                        {/* row */}
                        <Grid item>
                          <Grid container spacing={4}>
                            {/* item */}
                            <Grid item xs={12} md={6}>
                              <Grid container direction="column" spacing={1}>
                                <Grid item>
                                  <Typography type={TypoTypes.sub}>{t('Voucher ID')}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                                    {voucher.id}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            {/* item */}
                            {/* item */}
                            <Grid item xs={12} md={6}>
                              <Grid container direction="column" spacing={1}>
                                <Grid item>
                                  <Typography type={TypoTypes.sub}>{t('Time')}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                                    {(voucher.createdAt &&
                                      formatWithSchema(voucher.createdAt.seconds * 1000, 'dd MMM, yyyy')) ||
                                      '-'}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            {/* item */}
                          </Grid>
                        </Grid>
                        {/* row */}
                        <Grid item>
                          <Divider />
                        </Grid>
                        {/* row */}
                        <Grid item>
                          <Grid container spacing={4}>
                            {/* item */}
                            <Grid item xs={12} md={6}>
                              <Grid container direction="column" spacing={1}>
                                <Grid item>
                                  <Typography type={TypoTypes.sub}>{t('Voucher Type')}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                                    {t(ReceiptVoucherTypes.find((item) => item.value === voucher.type)?.name)}
                                    {t(PaymentVoucherTypes.find((item) => item.value === voucher.type)?.name)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            {/* item */}
                            {/* item */}
                            <Grid item xs={12} md={6}>
                              <Grid container direction="column" spacing={1}>
                                <Grid item>
                                  <Typography type={TypoTypes.sub}>
                                    {t('Voucher amount')} ({CURRENCY_TYPE.VND})
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                                    {formatCurrency(Math.abs(voucher.amount))}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            {/* item */}
                          </Grid>
                        </Grid>
                        {/* row */}
                        <Grid item>
                          <Divider />
                        </Grid>
                        {/* row */}
                        <Grid item>
                          <Grid container spacing={4}>
                            {/* item */}
                            <Grid item xs={12} md={6}>
                              <Grid container direction="column" spacing={1}>
                                <Grid item>
                                  <Typography type={TypoTypes.sub}>{t('Status')}</Typography>
                                </Grid>
                                <Grid item>
                                  <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                                    <VoucherStatusComp data={voucher.status} />
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                            {/* item */}
                          </Grid>
                        </Grid>
                        {/* row */}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
            {/* information */}
            {/* performed by */}
            <Grid item>{voucher && <PerformedByVoucherDetail data={voucher} />}</Grid>
            {/* performed by */}
          </Grid>
        )}
      </LayoutContainer>
    </div>
  );
};

export default VoucherDetail;
