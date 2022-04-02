import { GetStatisticRequest } from '@mcuc/stark/howard_pb';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { isLegalPermission } from 'components/AllowedTo/utils';
import { PerformPermission } from 'configs/routes/permission';
import { useGetUrlParams } from 'context/url_params_context/use_url_params';
import useAuth from 'hooks/useAuth';
import { getStatisticThunk } from 'redux/features/statistics/thunks';
import { getCurrentTimeZone, getFilterTypeByPeriod } from 'utils/date';

export function useGetStatisticsFetcher(paymentType) {
  const { period } = useGetUrlParams();
  const dispatch = useDispatch();

  const { userPermissions } = useAuth();

  useEffect(() => {
    async function doFetch() {
      if (period) {
        const payload: GetStatisticRequest.AsObject = {
          paymentType,
          filterType: getFilterTypeByPeriod(period),
          timeZone: getCurrentTimeZone(),
        };
        dispatch(getStatisticThunk(payload));
      }
    }

    if (isLegalPermission(PerformPermission.statistics.getStatistic, userPermissions)) {
      doFetch();
    }
  }, [dispatch, paymentType, period, userPermissions]);

  return null;
}
