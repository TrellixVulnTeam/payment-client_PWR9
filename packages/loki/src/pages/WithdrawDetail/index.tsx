import _get from 'lodash-es/get';
import { t } from 'i18next';
import { MethodType, PaymentType, Status } from '@mcuc/stark/stark_pb';
import { Box, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { StatusEnum } from 'redux/constant';
import { useAppSelector } from 'redux/store';
import { selectPaymentsState } from 'redux/features/payments/slice';
import { getPaymentDetailThunk } from 'redux/features/payments/thunks';

import PageLoader from 'components/PageLoader';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { useMerchantListFetcher } from 'pages/Merchant/useMerchantListFetcher';
import { APP_NAME } from 'utils/common';
import useUsersMap from 'hooks/useUsersMap';

import WithdrawProcess from './Process';
import WithdrawDetail from './WithdrawDetail';
import WithdrawPerformedBy from './PerformedBy';
import WithDrawActionHistory from './ActionHistory';
import WithdrawConductPayment from './ConductPayment';
import WithdrawPaymentDetail from './PaymentDetail';
import WithdrawCardInfo from './CardInfo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginBottom: theme.spacing(3),
    },
    merchantHeader: {
      display: 'flex',
      alignItems: 'center',
    },
    merchantLogo: {
      width: '120px',
      height: '120px',
      marginRight: theme.spacing(3),
    },
  }),
);

const WithdrawDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const location = useLocation();

  const classes = useStyles();

  const { selected, status } = useAppSelector(selectPaymentsState);

  const paymentMethod = _get(selected, 'payment.method');
  const paymentStatus = _get(selected, 'payment.status');
  const paymentType = _get(selected, 'payment.type');

  const isBank = paymentMethod === MethodType.T;
  const isPhone = paymentMethod === MethodType.P;
  const isCrypto = paymentMethod === MethodType.C;

  const [firstLoading, setFirstLoading] = useState(true);

  const { setBreadcrumbs } = useBreadcrumbs();

  useMerchantListFetcher();
  useUsersMap(selected?.revisionsList.map((item) => +item.createdBy));

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/payment/withdraw',
        label: t('Payment'),
      },
      {
        to: (location.state as any)?.from || '/payment/withdraw',
        label: t('Withdraw'),
      },
      {
        to: `/payment/withdraw-detail/${id}`,
        label: id,
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [id, setBreadcrumbs, location.state]);

  useEffect(() => {
    async function doFetch() {
      await dispatch(getPaymentDetailThunk({ id: Number(id) }));
      setFirstLoading(false);
    }
    if (id) {
      doFetch();
    }
  }, [dispatch, id]);

  const showCardInfo = isPhone && [Status.APPROVED, Status.COMPLETED].includes(paymentStatus);
  const showPaymentDetail = (isBank || isCrypto) && [Status.SUBMITTED, Status.COMPLETED].includes(paymentStatus);
  const showConductPayment = (isBank || isCrypto) && paymentStatus === Status.APPROVED;

  if (paymentType !== PaymentType.WITHDRAW) {
    return null;
  }

  if (firstLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Helmet>
        <title>
          {t('Withdraw detail')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer
        center
        maxWidth="lg"
        header={
          <Box>
            <Typography variant="h1" color="textSecondary">
              {t('Payment id')}{' '}
              <Typography component="span" variant="h1" color="textPrimary">
                {id}
              </Typography>
            </Typography>
          </Box>
        }
      >
        {(selected || status === StatusEnum.SUCCEEDED) && (
          <>
            <Box className={classes.container}>
              <WithdrawProcess payment={selected} />
            </Box>
            {showCardInfo && (
              <Box className={classes.container}>
                <WithdrawCardInfo payment={selected} />
              </Box>
            )}
            {showPaymentDetail && (
              <Box className={classes.container}>
                <WithdrawPaymentDetail payment={selected} />
              </Box>
            )}
            {showConductPayment && (
              <Box className={classes.container}>
                <WithdrawConductPayment payment={selected} />
              </Box>
            )}
            <Box className={classes.container}>
              <WithdrawDetail payment={selected} />
            </Box>
            <Box className={classes.container}>
              <WithdrawPerformedBy payment={selected} />
            </Box>
            <Box className={classes.container}>
              <WithDrawActionHistory payment={selected} />
            </Box>
          </>
        )}
      </LayoutContainer>
    </>
  );
};

export default WithdrawDetailPage;
