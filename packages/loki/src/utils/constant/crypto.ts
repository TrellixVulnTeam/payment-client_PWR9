import { CryptoNetworkType, CryptoType, CryptoWalletStatus } from '@mcuc/stark/ultron_pb';
import i18n from 'i18n';

export const USDT_TO_VND = 23000;

export const TRON_SCAN = 'https://tronscan.org';
export const BSC_SCAN = 'https://bscscan.com';
export const ERC_SCAN = 'https://etherscan.io';

export const STATUSES = [
  { name: i18n.t('Available'), value: CryptoWalletStatus.AVAILABLE },
  { name: i18n.t('Used'), value: CryptoWalletStatus.USED },
  { name: i18n.t('Banned'), value: CryptoWalletStatus.BANNED },
];

export const getCryptoStatus = (status: number): { value: number; name: string } | undefined => {
  return STATUSES.find((item) => item.value === status);
};

export const NETWORKS = [
  { name: 'ERC20', value: CryptoNetworkType.ERC20 },
  { name: 'BEP20', value: CryptoNetworkType.BEP20 },
  { name: 'TRC20', value: CryptoNetworkType.TRC20 },
];

export const getNetworkType = (network: number): { value: number; name: string } | undefined => {
  return NETWORKS.find((item) => item.value === network);
};

export const CRYPTO_TYPES = [{ name: 'USDT', value: CryptoType.USDT }];

export const getCryptoType = (type: number): { value: number; name: string } | undefined => {
  return CRYPTO_TYPES.find((item) => item.value === type);
};

export const truncateAddressCrypto = (address: string) => {
  if (address.length <= 10) return address;
  return address.slice(0, 5) + '...' + address.slice(address.length - 5, address.length);
};

export const getTronScan = (txHash: string) => {
  return `${TRON_SCAN}/#/transaction/${txHash}`;
};

export const getBscScan = (txHash: string) => {
  return `${BSC_SCAN}/tx/${txHash}`;
};

export const getErcScan = (txHash: string) => {
  return `${ERC_SCAN}/tx/${txHash}`;
};

export const getScanTxHash = (network: CryptoNetworkType, txHash: string) => {
  if (network === CryptoNetworkType.BEP20) return getBscScan(txHash);
  if (network === CryptoNetworkType.TRC20) return getTronScan(txHash);
  if (network === CryptoNetworkType.ERC20) return getErcScan(txHash);
  return '-';
};

export const convertUSDTToVND = (usdt: number) => {
  return usdt * USDT_TO_VND;
};

export const combineCryptoTypeAndNetwork = (cryptoType: CryptoType, networkType: CryptoNetworkType) => {
  return `${getCryptoType(cryptoType)?.name}_${getNetworkType(networkType)?.name}`;
};

export const getCryptoTypeFeeFromNetworkType = (network: CryptoNetworkType) => {
  if (network === CryptoNetworkType.BEP20) return 'BNB';
  if (network === CryptoNetworkType.TRC20) return 'TRX';
  if (network === CryptoNetworkType.ERC20) return 'ETH';
  return '-';
};
