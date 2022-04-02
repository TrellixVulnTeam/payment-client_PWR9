import { PaymentType, VoucherStatus } from '@mcuc/natasha/natasha_pb';
import i18n from 'i18n';

export const DEFAULT_PAGE_SIZE = 50;

export const ReceiptVoucherTypes = [
  {
    name: i18n.t('Additional'),
    value: PaymentType.MERCHANT_DEPOSIT_ADDITIONAL,
  },
  {
    name: i18n.t('Compensation'),
    value: PaymentType.MERCHANT_DEPOSIT_COMPENSATION,
  },
];

export const ReceiptVoucherStatuses = [
  {
    name: i18n.t('Processing'),
    value: VoucherStatus.PROCESSING,
  },
  {
    name: i18n.t('Completed'),
    value: VoucherStatus.COMPLETED,
  },
];
