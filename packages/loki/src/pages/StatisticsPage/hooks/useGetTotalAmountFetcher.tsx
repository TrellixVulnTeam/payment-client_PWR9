import _isEmpty from 'lodash-es/isEmpty';
import { Merchant } from '@mcuc/natasha/natasha_pb';
import { GetTotalAmountRequest } from '@mcuc/stark/howard_pb';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { getTotalAmountThunk } from 'redux/features/statistics/thunks';

import { PerformPermission } from 'configs/routes/permission';
import { isLegalPermission } from 'components/AllowedTo/utils';
import useAuth from 'hooks/useAuth';
import { getRangeByPeriod, formatTimeStampToSeconds, getCurrentTimeZone } from 'utils/date';
import { PeriodType } from 'context/url_params_context/resolve_url_params';
import { useGetUrlParams } from 'context/url_params_context/use_url_params';

export function useGetTotalAmountFetcher() {
  let { merchant_ids: merchantParams } = useGetUrlParams();
  const dispatch = useDispatch();

  const merchants = useSelector(selectDisplayMerchants);
  const merchantMapIds = useMemo(() => merchants.map((x: Merchant.AsObject) => x.id.toString()), [merchants]);

  const { userPermissions } = useAuth();

  useEffect(() => {
    async function doFetch() {
      let promise = null;
      let merchantIds = merchantParams ? merchantParams.split(',') : [];
      if (_isEmpty(merchantIds)) {
        merchantIds = [merchantMapIds[0]];
      }

      if (!_isEmpty(merchantIds) && !_isEmpty(merchantMapIds)) {
        const timeRange = getRangeByPeriod(PeriodType.Last7Days);
        const payload: GetTotalAmountRequest.AsObject = {
          fromDate: {
            seconds: formatTimeStampToSeconds(timeRange.start),
            nanos: 0,
          },
          toDate: {
            seconds: formatTimeStampToSeconds(timeRange.end),
            nanos: 0,
          },
          merchantsList: merchantIds
            .filter((id) => merchantIds.includes(id))
            .filter(Boolean)
            .map((x) => +x),
          timeZone: getCurrentTimeZone(),
        };

        if (isLegalPermission(PerformPermission.statistics.getTotalAmount, userPermissions)) {
          dispatch(getTotalAmountThunk(payload));
        }
      }

      if (!promise) {
        return;
      }
    }
    doFetch();
  }, [dispatch, userPermissions, merchantMapIds, merchantParams]);

  return null;
}
