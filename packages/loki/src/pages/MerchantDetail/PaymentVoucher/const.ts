import { PaymentType, VoucherStatus } from '@mcuc/natasha/natasha_pb';
import { t } from 'i18next';

export const PaymentVoucherTypes = [
  {
    name: t('Profit'),
    value: PaymentType.MERCHANT_WITHDRAW_PROFIT,
  },
  {
    name: t('Fund'),
    value: PaymentType.MERCHANT_WITHDRAW_FUNDS,
  },
];

export const PaymentVoucherStatuses = [
  {
    name: t('Processing'),
    value: VoucherStatus.PROCESSING,
  },
  {
    name: t('Completed'),
    value: VoucherStatus.COMPLETED,
  },
  {
    name: t('Canceled'),
    value: VoucherStatus.CANCELED,
  },
];
