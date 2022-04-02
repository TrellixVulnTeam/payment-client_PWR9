import { t } from 'i18next';
import { useState } from 'react';
import FilterBar from 'components/FilterBar';
import Icon from 'components/StyleGuide/Icon';
import Input from 'components/StyleGuide/Input';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import useCheckbox from 'hooks/useCheckbox';
import { Search } from 'assets/icons/ILT';
import styles from './styles.module.scss';
import _debounce from 'lodash-es/debounce';

interface Props {
  VoucherOptions: { name: string; value: number }[];
  voucherStatusOptions?: { name: string; value: number }[];
}

const Filter = (props: Props) => {
  const { VoucherOptions, voucherStatusOptions } = { ...props };

  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const { keyword: keywordParam, types: typesParam, status_ids: statusParam } = urlParams;

  const [keyword, setKeyword] = useState(keywordParam || '');

  // voucher type
  const selectedTypes = typesParam ? typesParam.split(',') : [];
  const options = VoucherOptions.map((item) => ({ ...item, value: item.value.toString() }));
  const {
    selected: selectedVoucherType,
    onChange: onChangeVoucherTypes,
    unselectAll: unselectAllVoucherTypes,
  } = useCheckbox(
    selectedTypes,
    options.map((item) => item.value.toString()),
    (items) => handleSelectTypes(items),
  );

  // status
  const selectedVoucher = statusParam ? statusParam.split(',') : [];
  const statusOptions = voucherStatusOptions.map((item) => ({ ...item, value: item.value.toString() }));
  const {
    selected: selectedVoucherStatus,
    onChange: onChangeVoucherStatuses,
    unselectAll: unselectAllVoucherStatuses,
  } = useCheckbox(
    selectedVoucher,
    statusOptions.map((item) => item.value.toString()),
    (items) => handleSelectStatuses(items),
  );

  function handleSelectTypes(selected = []) {
    setUrlParams({
      types: selected.join(','),
      period: '',
      page: 1,
    });
  }

  function handleSelectStatuses(selected = []) {
    setUrlParams({
      status_ids: selected.join(','),
      period: '',
      page: 1,
    });
  }

  const [debounceSearchKeyword] = useState(() =>
    _debounce((value = '') => {
      setUrlParams({
        keyword: value,
      });
    }, 300),
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitKeyword();
    }
  };

  const handleKeywordChange = (e) => {
    const { value } = e.target;
    setKeyword(value);
    debounceSearchKeyword(value);
  };

  const submitKeyword = () => {
    setUrlParams({
      keyword: keyword,
      period: '',
      page: 1,
    });
  };

  const handleClearFilter = () => {
    setKeyword('');
    unselectAllVoucherTypes();
    unselectAllVoucherStatuses();
    //
    clearUrlParams({
      ignoreParams: ['status'],
    });
  };

  const showReset = keywordParam || keywordParam || typesParam || statusParam;

  return (
    <FilterBar
      showReset={!!showReset}
      onClear={handleClearFilter}
      list={[
        {
          width: { xs: 3, md: 3 },
          component: (
            <Input
              value={keyword}
              placeholder={t('Search by {{key}}', { key: 'ID' })}
              afterInput={
                <InputAdornment onClick={submitKeyword}>
                  <Icon className={styles['search-icon']} component={Search} />
                </InputAdornment>
              }
              onChange={handleKeywordChange}
              onKeyDown={handleKeyDown}
            />
          ),
        },
        {
          width: { xs: 3, md: 2 },
          component: (
            <MultipleSelect
              placeholder={t('Voucher Type')}
              variant={SelectVariants.selected}
              selected={selectedVoucherType}
              onChange={onChangeVoucherTypes}
              onClear={unselectAllVoucherTypes}
              options={options}
            />
          ),
        },
        {
          width: { xs: 3, md: 2 },
          component: (
            <MultipleSelect
              placeholder={t('Status')}
              variant={SelectVariants.selected}
              selected={selectedVoucherStatus}
              onChange={onChangeVoucherStatuses}
              onClear={unselectAllVoucherStatuses}
              options={statusOptions}
            />
          ),
        },
      ]}
    />
  );
};

export default Filter;
