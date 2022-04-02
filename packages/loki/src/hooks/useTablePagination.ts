import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';

type Props = {
  defaultPage: number;
  defaultPageSize: number;
};

export default function usePaginationTable({ defaultPage, defaultPageSize }: Props) {
  const [currentParams, setUrlParams] = useUpdateUrlParams();

  const { page: paginationPageParam = defaultPage, pageSize: paginationPageSizeParam = defaultPageSize } =
    currentParams;

  const handleChangePageSize = (size: number) => {
    if (size !== paginationPageSizeParam) {
      setUrlParams({ pageSize: size, page: defaultPage });
    }
  };

  const handleChangePage = (page: number) => {
    if (page !== paginationPageParam) {
      setUrlParams({ page });
    }
  };

  const handleResetPagination = () => {
    setUrlParams({ page: defaultPage, pageSize: defaultPageSize });
  };

  return {
    page: paginationPageParam,
    pageSize: paginationPageSizeParam,
    onChangePage: handleChangePage,
    onChangePageSize: handleChangePageSize,
    onResetPagination: handleResetPagination,
  };
}
