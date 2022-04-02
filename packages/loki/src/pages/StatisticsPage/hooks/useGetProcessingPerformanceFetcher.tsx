import { Merchant } from '@mcuc/natasha/natasha_pb';
import { GetProcessingPerformanceRequest } from '@mcuc/stark/howard_pb';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { PerformPermission } from 'configs/routes/permission';
import { PeriodType } from 'context/url_params_context/resolve_url_params';
import { useGetUrlParams } from 'context/url_params_context/use_url_params';
import useAuth from 'hooks/useAuth';
import _isEmpty from 'lodash-es/isEmpty';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { getProcessingPerformanceThunk } from 'redux/features/statistics/thunks';
import { toNumber } from 'utils';
import { formatTimeStampToSeconds, getRangeByPeriod } from 'utils/date';

export function useProcessingPerformanceFetcher() {
  let { merchant: merchantParam } = useGetUrlParams();
  const dispatch = useDispatch();

  const merchants = useSelector(selectDisplayMerchants);
  const merchantIds = useMemo(() => merchants.map((x: Merchant.AsObject) => x.id.toString()), [merchants]);

  const { userPermissions } = useAuth();

  useEffect(() => {
    async function doFetch() {
      let promise = null;
      let merchant = merchantParam || merchantIds[0];
      if (merchant && !_isEmpty(merchantIds)) {
        const timeRange = getRangeByPeriod(PeriodType.Last7Days);
        const payload: GetProcessingPerformanceRequest.AsObject = {
          fromDate: {
            seconds: formatTimeStampToSeconds(timeRange.start),
            nanos: 0,
          },
          toDate: {
            seconds: formatTimeStampToSeconds(timeRange.end),
            nanos: 0,
          },
          merchantId: toNumber(merchant),
        };

        if (isLegalPermission(PerformPermission.statistics.getProcessingPerformance, userPermissions)) {
          dispatch(getProcessingPerformanceThunk(payload));
        }
      }

      if (!promise) {
        return;
      }
    }
    doFetch();
  }, [dispatch, merchantIds, merchantParam, userPermissions]);

  return null;
}
