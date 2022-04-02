import { SyntheticEvent, useCallback, useState } from 'react';

export default function useRadio(defaultValue) {
  const [selected, updateSelected] = useState(defaultValue);

  const onChange = useCallback(
    (event: SyntheticEvent) => {
      updateSelected((event.target || ({} as any)).value);
    },
    [updateSelected],
  );

  return { selected, onChange };
}
