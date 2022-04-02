import { SyntheticEvent } from 'react';
import checkFieldType from 'utils/common/checkFieldType';
import getWindow from 'utils/common/getWindow';
import useEnhancedEffect from './useEnhancedEffect';
import useEventCallback from './useEventCallback';

export default function useEventListener(
  element: HTMLElement | Window,
  event: string,
  fn: (event: SyntheticEvent) => void,
) {
  const win = getWindow();
  const el = element || win;

  const handler = useEventCallback(fn);
  const destroy = () =>
    checkFieldType(el, 'removeEventListener', 'function') && el.removeEventListener(event, handler as any);

  useEnhancedEffect(() => {
    if (checkFieldType(el, 'addEventListener', 'function')) {
      el.addEventListener(event, handler as any);
    }

    return destroy;
  }, []);

  return destroy;
}
