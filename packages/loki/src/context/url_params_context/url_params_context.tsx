import { createContext, useMemo, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { PeriodType, resolveUrlParams } from './resolve_url_params';

export type IUrlParams = {
  tab: string;
  page: number;
  pageSize: number;
  size: number;
  period: PeriodType;
  merchant: string;
  startDate: number;
  endDate: number;
  types: string;
  q: string;
  status_ids: string;
  status: string;
  keyword: string;
  merchant_ids: string;
  role: string;
  role_ids: string;
  bank_ids: string;
  ewallet_ids: string;
  telco_ids: string;
  search: string;
  group_ids: string;
  network: string;
  network_ids: string;
  crypto_type: string;
  crypto_type_ids: string;
};

const UrlParamsContext = createContext({
  urlParams: {} as Partial<IUrlParams>,
});

const UrlParamsProvider = withRouter(({ location, children }) => {
  const refUrlParams = useRef(resolveUrlParams(location));

  const urlParams = useMemo(() => resolveUrlParams(location), [location]);
  refUrlParams.current = urlParams;

  const contextValue = useMemo(() => {
    return {
      urlParams,
    };
  }, [urlParams]);

  return <UrlParamsContext.Provider children={children} value={contextValue} />;
});

export { UrlParamsProvider, UrlParamsContext };
