import { Merchant } from '@mcuc/natasha/natasha_pb';
import { t } from 'i18next';
import React, { SyntheticEvent, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import useCheckbox from 'hooks/useCheckbox';

interface Props {}

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

  const merchantIds = useMemo(() => (merchantParams ? merchantParams.split(',') : []), [merchantParams]);

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
    if (selectedItems) {
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
      placeholder={
        selectedItems.length > 0
          ? t('Merchant')
          : `${t('Merchant')}: ${t('All {{key}}', { key: t('Merchant').toLowerCase() })}`
      }
      selected={selectedItems}
      onChange={handleChange}
      onClear={handleClear}
      options={merchantList}
    />
  );
};

export default FilterByMerchant;
