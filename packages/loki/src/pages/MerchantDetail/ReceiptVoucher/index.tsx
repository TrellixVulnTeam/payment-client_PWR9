import { t } from 'i18next';
import { Voucher } from '@mcuc/natasha/natasha_pb';
import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory, useParams } from 'react-router-dom';
import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getMerchantThunk } from 'redux/features/merchants/thunks';
import { selectMerchantSelected } from 'redux/features/merchants/slice';
import { selectVoucherStatus, selectVouchers, selectTotalRecord } from 'redux/features/vouchers/slice';

import { MerchantHeader } from 'pages/MerchantMoney';
import AllowedTo from 'components/AllowedTo';
import AlopayTable from 'components/AlopayTable';
import LayoutContainer from 'components/Layout/LayoutContainer';
import Typography, { TypoWeights } from 'components/StyleGuide/Typography';
import { AvatarAndUsername } from 'components/Table/lib';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';

import { PerformPermission } from 'configs/routes/permission';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import useUsersMap from 'hooks/useUsersMap';
import { formatCurrency, APP_NAME } from 'utils/common';
import { formatWithSchema } from 'utils/date';

import Filter from './Filter';
import CreateVoucher from './CreateVoucher';
import VoucherStatus from '../VoucherStatus';
import useFetchVoucher from './useFetchVoucher';
import { DEFAULT_PAGE_SIZE, ReceiptVoucherStatuses, ReceiptVoucherTypes } from './const';
import styles from './styles.module.scss';

interface Props {}

const ReceiptVoucher = (props: Props) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [currentUrlParams, setUrlParams] = useUpdateUrlParams();
  const [reloadAPI] = useFetchVoucher(ReceiptVoucherTypes, ReceiptVoucherStatuses);

  const { page = 1, pageSize } = currentUrlParams;

  const merchant = useAppSelector(selectMerchantSelected);
  const vouchers = useAppSelector(selectVouchers);
  const totalRecord = useAppSelector(selectTotalRecord);
  const status = useAppSelector(selectVoucherStatus);

  const { setBreadcrumbs } = useBreadcrumbs();

  const { usersMap } = useUsersMap(vouchers.map((item) => +item.createdBy));
  const [pagination, setPagination] = useState({
    page,
    size: pageSize || DEFAULT_PAGE_SIZE,
  });

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
          to: ``,
          label: `${t('Receipt Voucher Detail')}`,
          active: true,
        },
      ];
      setBreadcrumbs(breadcrumbs);
    }
  }, [setBreadcrumbs, merchant]);

  useEffect(() => {
    dispatch(getMerchantThunk({ id: +id }));
  }, [dispatch, id]);

  function setCurrentPage(page) {
    if (page !== pagination.page) {
      setPagination({
        page,
        size: pagination.size,
      });
      setUrlParams({
        page,
        period: '',
      });
    }
  }

  function setPageSize(size) {
    if (size !== pagination.size) {
      setPagination({
        page: 1,
        size,
      });
      setUrlParams({
        page: 1,
        size,
        period: '',
      });
    }
  }

  function reloadData() {
    reloadAPI();
  }

  const columns = [
    {
      Header: t('Voucher ID'),
      accessor: (row: Voucher.AsObject) => <Typography weight={TypoWeights.bold}>{row.id}</Typography>,
    },
    {
      Header: t('Voucher type'),
      accessor: (row: Voucher.AsObject) => ReceiptVoucherTypes.find((item) => item.value === row.type)?.name || '-',
    },
    {
      Header: t('Created by'),
      accessor: (row: Voucher.AsObject) => (
        <Grid container spacing={1}>
          <Grid item xs="auto">
            <AvatarAndUsername
              name={usersMap[row.createdBy]?.metadata.fullName}
              avatar={usersMap[row.createdBy]?.metadata.picture}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      Header: t('Amount'),
      accessor: (row: Voucher.AsObject) => formatCurrency(Math.abs(row.amount)) || '-',
    },
    {
      Header: t('Time'),
      accessor: (row: Voucher.AsObject) =>
        (row.createdAt && formatWithSchema(row.createdAt.seconds * 1000, 'dd MMM yyyy')) || '-',
    },
    {
      Header: t('Status'),
      accessor: (row: Voucher.AsObject) => <VoucherStatus data={row.status} />,
    },
  ];

  return (
    <div className={styles['root']}>
      <Helmet>
        <title>{t('Receipt Voucher Detail')} - {APP_NAME}</title>
      </Helmet>
      <LayoutContainer
        header={
          <MerchantHeader merchant={{ ...merchant, name: `${merchant?.name || ''} - ${t('Receipt Voucher Detail')}` }} />
        }
        maxWidth={false}
      >
        <Grid container className={styles.root} spacing={4}>
          <Grid item xs={12}>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={true}>
                <Filter VoucherOptions={ReceiptVoucherTypes} voucherStatusOptions={ReceiptVoucherStatuses} />
              </Grid>
              <AllowedTo perform={PerformPermission.merchantReceipt.createVoucher} watch={[reloadData]}>
                <Grid item xs="auto">
                  <CreateVoucher VoucherOptions={ReceiptVoucherTypes} callback={reloadData} />
                </Grid>
              </AllowedTo>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <AlopayTable
              columns={columns}
              data={vouchers}
              pagination={{
                totalRecord,
                current: pagination.page,
                pageSize: pagination.size,
                onChangePage: setCurrentPage,
                onChangePageSize: setPageSize,
              }}
              loading={status === StatusEnum.LOADING}
              tableRowProps={{
                onClick: (row) => {
                  history.push(`/merchant/${merchant.id}/receipt-detail/${row.id}`);
                },
              }}
            />
          </Grid>
        </Grid>
      </LayoutContainer>
    </div>
  );
};

export default ReceiptVoucher;
