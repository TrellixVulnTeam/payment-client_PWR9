import { GroupBase, IOption, ISelected, OptionsOrGroups } from 'components/StyleGuide/GroupDropdown';
import _remove from 'lodash-es/remove';
import { SyntheticEvent, useCallback, useState } from 'react';
import { isFunction } from 'utils/common';

export default function useCheckboxGroup(
  defaultValue: ISelected[],
  valuesOfOptions?: OptionsOrGroups<IOption, GroupBase<IOption>>,
  func?: (...args: any[]) => any,
) {
  const [selected, updateSelected] = useState<ISelected[]>(defaultValue || []);

  const onChange = useCallback(
    (event: SyntheticEvent) => {
      let result = [];
      const { value, groupIndex: selectedGroupIndex } = event.target || ({} as any);
      const groupValue = valuesOfOptions[selectedGroupIndex].groupValue || '';
      /**
       *  Case select group, reselect all remain items in group
       *  Case 1: If is intermediate or unselect, select all
       *  Case 2: If is select all, unselect all
       */
      if ((value === null || value === undefined) && selectedGroupIndex > -1) {
        // select all
        const itemsOfGroup = selected.filter((x: ISelected) => x.groupIndex === selectedGroupIndex);
        const isIntermediate = itemsOfGroup.length < valuesOfOptions[selectedGroupIndex].options.length;

        if (isIntermediate) {
          const allValuesOfGroup = valuesOfOptions[selectedGroupIndex].options;
          const remainItems = [];

          allValuesOfGroup.forEach((item: IOption) => {
            const foundIndex = selected.findIndex(
              (x: ISelected) => x.value === item.value && x.groupIndex === selectedGroupIndex,
            );
            const isNotExist = foundIndex === -1;
            if (isNotExist) {
              remainItems.push({ ...item, groupValue, groupIndex: selectedGroupIndex });
            }
          });

          result = [...selected, ...remainItems];
          updateSelected(result);
        } else {
          // unselect all
          result = selected.filter((x: ISelected) => x.groupIndex !== selectedGroupIndex);
          updateSelected(result);
        }
      } else if (selectedGroupIndex > -1) {
        // select per item
        const foundIndex = selected.findIndex(
          (x: ISelected) => x.value === value && x.groupIndex === selectedGroupIndex,
        );
        if (foundIndex > -1) {
          const cloned = [...selected];
          _remove(cloned, (v: ISelected) => v.value === value && v.groupIndex === selectedGroupIndex);
          result = [...cloned];
          updateSelected(result);
        } else {
          const allValuesOfGroup = valuesOfOptions[selectedGroupIndex].options;
          const newItem = allValuesOfGroup.find(item => item.value === value)
          result = [
            ...selected,
            {
              ...newItem,
              groupValue,
              groupIndex: selectedGroupIndex,
            },
          ];
          updateSelected(result);
        }
      }
      if (func && isFunction(func)) {
        func.apply(this, [result]);
      }
    },
    [func, selected, valuesOfOptions],
  );

  const onClear = useCallback(() => {
    updateSelected([]);
    if (func && isFunction(func)) {
      func.apply(this, []);
    }
  }, [updateSelected, func]);

  return {
    selected,
    onChange,
    onClear,
  };
}
