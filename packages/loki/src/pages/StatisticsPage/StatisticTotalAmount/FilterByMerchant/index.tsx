import { t } from 'i18next';
import { Merchant } from '@mcuc/natasha/natasha_pb';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import React, { SyntheticEvent, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import useCheckbox from 'hooks/useCheckbox';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';

interface Props {}

const MAX_SELECTED_ITEMS = 4;

const FilterByMerchant = (props: Props) => {
  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();
  let { merchant_ids: merchantParams } = urlParams;

  const merchants = useSelector(selectDisplayMerchants);
  const merchantList = React.useMemo(
    () =>
      merchants.map((x: Merchant.AsObject) => ({
        name: x.name,
        value: x.id.toString(),
      })),
    [merchants],
  );

  const merchantIds = useMemo(
    () => (merchantParams ? merchantParams.split(',') : _isEmpty(merchantList) ? [] : [merchantList[0].value]),
    [merchantParams, merchantList],
  );

  useEffect(() => {
    if (_isEmpty(merchantParams)) {
      if (merchantList.length) {
        setUrlParams({
          merchant_ids: [merchantList[0].value].join(','),
        });
      }
    }
    // eslint-disable-next-line
  }, []);

  const options = merchantList.map((item) => ({ ...item, value: item.value.toString() }));
  const {
    selected: selectedItems,
    onChange: onChangeItems,
    unselectAll: onClear,
  } = useCheckbox(
    merchantIds,
    options.map((item) => item.value.toString()),
    (items) => handleSelectMerchant(items),
  );

  function handleSelectMerchant(selected: string[] = []) {
    setUrlParams({
      merchant_ids: selected.join(','),
    });
  }

  function handleChange(event: SyntheticEvent) {
    const value = _get(event, 'target.value');
    if (selectedItems && (selectedItems.length < MAX_SELECTED_ITEMS || selectedItems.includes(value))) {
      onChangeItems(event);
    }
  }

  function handleClear() {
    clearUrlParams();
    onClear();
  }

  return (
    <MultipleSelect
      variant={SelectVariants.selected}
      note={t('Maximum 4 options select')}
      placeholder={t('Merchant')}
      selected={selectedItems}
      onChange={handleChange}
      onClear={handleClear}
      options={merchantList}
    />
  );
};

export default FilterByMerchant;
