import { useGetUrlParams } from 'context/url_params_context/use_url_params';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getListMerchantsThunk } from 'redux/features/merchants/thunks';

export function useMerchantListFetcher() {
  const { keyword } = useGetUrlParams();
  
  const dispatch = useDispatch();
  const [pagination] = useState({
    size: 50,
    page: 1,
  });

  useEffect(() => {
    async function doFetch() {
      let promise = null;

      dispatch(
        getListMerchantsThunk({
          ...pagination,
          keyword,
        }),
      );

      if (!promise) {
        return;
      }
    }
    doFetch();
  }, [dispatch, keyword, pagination]);

  return null;
}
