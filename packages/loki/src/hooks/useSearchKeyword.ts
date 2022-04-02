import { useRef, useState } from 'react';
import _debounce from 'lodash-es/debounce';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';

type Props = {
  defaultKeyword?: string;
  defaultPage?: number;
  defaultPageSize?: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_KEYWORD = '';

export default function useSearchKeyword({
  defaultKeyword = DEFAULT_KEYWORD,
  defaultPage = DEFAULT_PAGE,
  defaultPageSize = DEFAULT_PAGE_SIZE,
}: Props = {}) {
  const [currentParams, setUrlParams] = useUpdateUrlParams();
  const { keyword: keywordParam = defaultKeyword } = currentParams;

  const [keyword, setKeyword] = useState(keywordParam);

  const handleChangeKeyword = (e) => {
    const { value } = e.target;
    setKeyword(value);
    debounceChangeKeywordParam(value);
  };

  const debounceChangeKeywordParam = useRef(
    _debounce((value = '') => {
      setUrlParams({
        keyword: value,
        page: defaultPage,
        size: defaultPageSize,
      });
    }, 300),
  ).current;

  const handleSubmitKeyword = () => {
    setUrlParams({ keyword });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmitKeyword();
    }
  };

  const handleClearKeyword = (value?: string) => {
    setKeyword(value || DEFAULT_KEYWORD);
  };

  return {
    keyword,
    onKeyDownKeyword: handleKeyDown,
    onClearKeyword: handleClearKeyword,
    onSubmitKeyword: handleSubmitKeyword,
    onChangeKeyword: handleChangeKeyword,
  };
}
