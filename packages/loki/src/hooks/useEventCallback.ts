import { SyntheticEvent, useCallback, useRef } from 'react';
import useEnhancedEffect from './useEnhancedEffect';

export default function useEventCallback(fn) {
  const ref = useRef(fn);

  useEnhancedEffect(() => {
    ref.current = fn;
  });

  return useCallback((event?: SyntheticEvent) => ref.current(event), []);
}
