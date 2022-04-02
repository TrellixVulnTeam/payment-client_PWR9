import { stringify } from 'query-string';
import { useContext, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { toQuery } from 'utils/url_helpers';
import { resolveUrlParams } from './resolve_url_params';
import { IUrlParams, UrlParamsContext } from './url_params_context';

export function useUrlParams() {
  return useContext(UrlParamsContext);
}

export type UpdateUrlParams = (updatedParams: { [key: string]: string | number | boolean | undefined }) => void;

export type ClearUrlParams = (config?: { ignoreParams?: string[] }) => void;

export type UptimeUrlParamsHook = () => [IUrlParams, UpdateUrlParams, ClearUrlParams];

export type GetUrlParams = () => IUrlParams;

export const useGetUrlParams: any = () => {
  const location = useLocation();
  return resolveUrlParams(location);
};

export const useUpdateUrlParams: any = () => {
  const location = useLocation();
  const history = useHistory();

  const urlParams = useMemo(() => resolveUrlParams(location), [location]);

  const updateUrlParams: UpdateUrlParams = (updatedParams) => {
    if (!history || !location) return;
    const { pathname } = location;

    const oldUrlParams = toQuery(window.location.search);

    const mergedParams = {
      ...oldUrlParams,
      ...updatedParams,
    };

    history.push({
      pathname,
      search: stringify(
        // drop any parameters that have no value
        Object.keys(mergedParams).reduce((params, key) => {
          const value = mergedParams[key];
          if (value === undefined || value === '') {
            return params;
          }
          return {
            ...params,
            [key]: value,
          };
        }, {}),
        { sort: false },
      ),
    });
  };

  const clearUrlParams: ClearUrlParams = (config = {}) => {
    if (!history || !location) return;
    const { pathname } = location;
    const { ignoreParams = [] } = config;
    history.push({
      pathname,
      search: stringify(
        Object.keys(urlParams).reduce((params, key) => {
          if (ignoreParams.includes(key)) {
            const value = urlParams[key];
            params[key] = value;
          }
          return params;
        }, {}),
        { sort: false },
      ),
    });
  };

  return [urlParams, updateUrlParams, clearUrlParams];
};
