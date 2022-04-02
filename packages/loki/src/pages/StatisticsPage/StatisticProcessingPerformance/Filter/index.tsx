import { Merchant } from '@mcuc/natasha/natasha_pb';
import DropdownList from 'components/StyleGuide/DropdownList';
import Option from 'components/StyleGuide/Option';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import _isEmpty from 'lodash-es/isEmpty';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';

interface Props {}

const Filter = (props: Props) => {
  const [urlParams, setUrlParams] = useUpdateUrlParams();

  const merchants = useSelector(selectDisplayMerchants);
  const merchantList = React.useMemo(
    () =>
      merchants.map((x: Merchant.AsObject) => ({
        label: x.name,
        value: x.id.toString(),
        panel: null,
      })),
    [merchants],
  );
  let { merchant: merchantParam } = urlParams;
  let merchant = merchantParam;
  if (!_isEmpty(merchantList)) {
    merchant = !!merchantParam ? merchantParam : merchantList[0].value;
  }

  function handleChange(selected) {
    setUrlParams({
      merchant: selected,
    });
  }

  return (
    <DropdownList value={merchant} onChange={handleChange} variant={SelectVariants.selected} placeholder="Merchant:">
      {merchantList.map((item) => (
        <Option key={item.value} value={item.value}>
          {item.label}
        </Option>
      ))}
    </DropdownList>
  );
};

export default Filter;
