import { Status } from '@mcuc/stark/stark_pb';
import Box from '@material-ui/core/Box';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'redux/reducers';
import { StatusEnum } from 'redux/constant';
import { getPaymentDetailThunk } from 'redux/features/payments/thunks';

import { useMerchantListFetcher } from 'pages/Merchant/useMerchantListFetcher';
import LayoutContainer from 'components/Layout/LayoutContainer';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import useUsersMap from 'hooks/useUsersMap';
import { APP_NAME } from 'utils/common';

import TopUpProcess from './Process';
import TopUpDetail from './TopUpDetail';
import ButtonStatus from './ButtonStatus';
import TopUpPerformedBy from './PerformedBy';
import TopupActionHistory from './ActionHistory';
import PageLoader from 'components/PageLoader';

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

const TopUpDetailPage = () => {
  const location = useLocation();

  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const classes = useStyles();

  const { selected, status } = useSelector((state: RootState) => state.payments);
  const { setBreadcrumbs } = useBreadcrumbs();

  const [firstLoading, setFirstLoading] = useState(true);

  useMerchantListFetcher();
  useUsersMap(selected?.revisionsList.map((item) => +item.createdBy));

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/payment/top-up',
        label: t('Payment'),
      },
      {
        to: (location.state as any)?.from || '/payment/top-up',
        label: t('Top-up'),
      },
      {
        to: `/payment/top-up-detail/${id}`,
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

  const isNew = selected && selected.payment.status === Status.CREATED;

  if (firstLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <Helmet>
        <title>
          {t('Top-up detail')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer
        center
        maxWidth="lg"
        header={
          <Typography variant={TypoVariants.head1} type={TypoTypes.sub}>
            {t('Payment id')}{' '}
            <Typography component="span" variant={TypoVariants.head1}>
              {id}
            </Typography>
          </Typography>
        }
        actions={isNew && <ButtonStatus payment={selected} />}
      >
        {(selected || status === StatusEnum.SUCCEEDED) && (
          <>
            <Box className={classes.container}>
              <TopUpProcess payment={selected} />
            </Box>
            <Box className={classes.container}>
              <TopUpDetail payment={selected} />
            </Box>
            <Box className={classes.container}>
              <TopUpPerformedBy payment={selected} />
            </Box>
            <Box className={classes.container}>
              <TopupActionHistory payment={selected} />
            </Box>
          </>
        )}
      </LayoutContainer>
    </>
  );
};

export default TopUpDetailPage;
