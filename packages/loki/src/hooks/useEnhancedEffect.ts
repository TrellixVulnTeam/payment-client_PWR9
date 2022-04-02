import { useEffect, useLayoutEffect } from 'react';
import checkIsBrowser from 'utils/common/checkIsBrowser';

const isBrowser = checkIsBrowser();
const useEnhancedEffect = isBrowser ? useLayoutEffect : useEffect;

export default useEnhancedEffect;
