import { useGetUrlParams } from 'context/url_params_context/use_url_params';
import _isEmpty from 'lodash-es/isEmpty';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getVouchersThunk } from 'redux/features/vouchers/thunks';
import { DEFAULT_PAGE_SIZE } from './const';

function useFetchVoucher(VoucherOptions = [], voucherStatusOptions = []) {
  const { id } = useParams<{ id: string }>();
  let { types: typeParams, status_ids: statusParams, page, size, keyword } = useGetUrlParams();
  const dispatch = useDispatch();

  // voucher type mapping
  const receiptVoucherTypesMapIds = useMemo(
    () => VoucherOptions.filter(Boolean).map((x) => Number(x.value)),
    [VoucherOptions],
  );
  let ids = [...(Array.isArray(typeParams) ? [...typeParams] : [typeParams])].filter(Boolean) || [];
  if (_isEmpty(ids)) {
    ids = [...receiptVoucherTypesMapIds];
  }
  const strTypeIds = ids.join(',');

  // status type mapping
  const receiptVoucherStatusesMapIds = useMemo(
    () => voucherStatusOptions.filter(Boolean).map((x) => Number(x.value)),
    [voucherStatusOptions],
  );
  let statusIds = [...(Array.isArray(statusParams) ? [...statusParams] : [statusParams])].filter(Boolean) || [];
  if (_isEmpty(ids)) {
    statusIds = [...receiptVoucherStatusesMapIds];
  }
  const strStatusIds = statusIds.join(',');

  const doFetch = useCallback(async () => {
    let promise = null;

    const payload = {
      merchantId: +id,
      id: isNaN(+keyword) ? 0 : +keyword,
      typesList: strTypeIds
        .split(',')
        .filter(Boolean)
        .map((x) => +x),
      statusesList: strStatusIds
        .split(',')
        .filter(Boolean)
        .map((x) => +x),
      page: !!page ? page : 1,
      size: !!size ? size : DEFAULT_PAGE_SIZE,
    };
    dispatch(getVouchersThunk(payload));

    if (!promise) {
      return;
    }
  }, [dispatch, id, page, keyword, size, strStatusIds, strTypeIds]);

  useEffect(() => {
    doFetch();
  }, [dispatch, doFetch, id, page, keyword]);

  return [doFetch];
}

export default useFetchVoucher;
