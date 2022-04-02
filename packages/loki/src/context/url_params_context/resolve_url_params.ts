import { Location } from 'history';
import _identity from 'lodash-es/identity';
import _pickBy from 'lodash-es/pickBy';
import { toNumber } from 'utils';
import { toQuery } from 'utils/url_helpers';

export enum PeriodType {
  Daily = 'daily',
  Weekly = 'weekly',
  Yesterday = 'yesterday',
  Monthly = 'monthly',
  Last7Days = 'last7Days',
  Last30Days = 'last30days',
  LastWeek = 'lastWeek',
  LastMonth = 'lastMonth',
  LastYear = 'lastYear',
  ThisWeek = 'thisWeek',
  ThisMonth = 'thisMonth',
  ThisYear = 'thisYear',
  Custom = 'custom',
}

export const Periods = Object.values(PeriodType);

export function resolveUrlParams(location: Location) {
  const query = toQuery(location.search);
  const {
    page: pagePrams,
    pageSize: pageSizeParams,
    size: sizeParams,
    period: periodParams,
    merchant: merchantIdParams,
    bank_ids,
    merchant_ids,
    startDate,
    endDate,
    types,
    q,
    status,
    role,
    status_ids,
    role_ids,
    keyword,
    ewallet_ids,
    telco_ids,
    search,
    tab,
    group_ids,
    network_ids,
    network,
    crypto_type_ids,
  } = query;

  const page = pagePrams ? toNumber(pagePrams) : undefined;
  const pageSize = pageSizeParams ? toNumber(pageSizeParams) : undefined;
  const size = sizeParams ? toNumber(sizeParams) : undefined;

  return _pickBy(
    {
      page,
      size,
      pageSize,
      period: periodParams,
      merchant: merchantIdParams,
      merchant_ids,
      startDate: +startDate,
      endDate: +endDate,
      types,
      q,
      bank_ids,
      role,
      role_ids,
      status,
      status_ids,
      keyword,
      ewallet_ids,
      telco_ids,
      search,
      tab,
      group_ids,
      network_ids,
      network,
      crypto_type_ids,
    },
    _identity,
  );
}
