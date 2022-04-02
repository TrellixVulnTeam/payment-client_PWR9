import { SyntheticEvent, useCallback, useState } from 'react';
import { isFunction } from 'utils/common';

export default function useCheckbox(defaultValues: string[], valuesOfOptions: string[], func?: (...args: any) => any) {
  const [selected, updateSelected] = useState(defaultValues || []);

  const onChange = useCallback(
    (event: SyntheticEvent) => {
      const { value } = event.target || ({} as any);
      const isExisted = selected.find((v) => v === value);
      let result = [...selected];
      if (isExisted) {
        result = selected.filter((v) => v !== value);
      } else {
        result.push(valuesOfOptions.find((v) => v === value));
      }
      updateSelected(result);
      if (func && isFunction(func)) {
        func.apply(this, [result]);
      }
    },
    [selected, updateSelected, func, valuesOfOptions],
  );

  const selectAll = useCallback(() => {
    updateSelected(valuesOfOptions);
    if (func && isFunction(func)) {
      func.apply(this, [valuesOfOptions]);
    }
  }, [valuesOfOptions, updateSelected, func]);

  const unselectAll = useCallback(() => {
    updateSelected([]);
    if (func && isFunction(func)) {
      func.apply(this, []);
    }
  }, [updateSelected, func]);

  const isIntermediate = selected.length < valuesOfOptions.length;

  return {
    selected,
    isIntermediate,
    onChange,
    selectAll,
    unselectAll,
    updateSelected,
  };
}
