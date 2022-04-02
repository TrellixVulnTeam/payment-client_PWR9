import { EWalletName } from '@mcuc/stark/tony_pb';
import { PAGE_SIZE_OPTIONS } from 'components/BaseTable/const';

export const PROVIDERS = [
  {
    name: 'Momo',
    value: EWalletName.MOMO,
  },
  {
    name: 'Zalopay',
    value: EWalletName.ZALOPAY,
  },
];

export const DEFAULT_PAGE_SIZE = PAGE_SIZE_OPTIONS[0];
export const DEFAULT_PAGE = 1;
