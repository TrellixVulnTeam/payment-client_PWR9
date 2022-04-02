import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import useCheckbox from 'hooks/useCheckbox';
import { t } from 'i18next';
import React, { useCallback, useMemo } from 'react';

type Props = {
  defaultSelected?: string[];
  options: {
    name: string;
    value: string;
  }[];
  placeholder?: string;
  onSelect: (option: string[]) => void;
};

const FilterDropdown: React.FC<Props> = ({ onSelect, placeholder = t('Select'), options, defaultSelected = [] }) => {
  const optionValues = useMemo(() => options.map((item) => item.value.toString()), [options]);

  const handleSelect = useCallback(
    (options: string[]) => {
      if (typeof onSelect !== 'undefined') {
        onSelect(options);
      }
    },
    [onSelect],
  );

  const {
    selected: selectedBanks,
    onChange: onChangeBanks,
    unselectAll: unselectAllBanks,
  } = useCheckbox(defaultSelected, optionValues, handleSelect);

  return (
    <MultipleSelect
      variant={SelectVariants.selected}
      placeholder={placeholder}
      selected={selectedBanks}
      onChange={onChangeBanks}
      onClear={unselectAllBanks}
      options={options}
    />
  );
};

export default FilterDropdown;
