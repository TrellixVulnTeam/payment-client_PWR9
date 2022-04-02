import { t } from 'i18next';
import { BANKS, CRYPTOS, TELCOS } from 'utils/constant/payment';

export const providerOptions = [
  {
    name: t('Bank Transfer'),
    groupValue: 'bank',
    options: BANKS.map((item) => ({
      name: item.name,
      value: item.value.toString(),
    })),
  },
  {
    name: t('Telco'),
    groupValue: 'telco',
    options: TELCOS.map((item) => ({
      name: item.name,
      value: item.value.toString(),
    })),
  },
  {
    name: t('Crypto'),
    groupValue: 'crypto',
    options: CRYPTOS.map((item) => ({
      name: item.name,
      value: item.value.toString(),
    })),
  },
];
